import React from 'react'
import { Badge } from 'react-bootstrap'
import BaseRepository from './../repositories/base'
import ErrorRepository from './../repositories/error'
import SessionRepository from './../repositories/session'
import MessagesRepository from './../repositories/messages'
import ContactsRepository from './../repositories/contacts'

class MessagesRepositoryForWS extends BaseRepository {
  constructor () {
    super()
    this.name = 'MessagesRepositoryForWS'
    this.ttl = 1000 * 60 // 1 minute
    this.key = 'repository:messages'
    this.responseKeys = ['messages']
  }

  async appendForTeam (message) {
    this.key = `repository:messages:${message.contactId}`
    // const messagesResponse = await this.get()
    const response = JSON.parse(this.storage.getItem(this.key))
    if (response && response.data) {
      let messages = response.data.messages || []
      messages.push(message)
      await this.set({ messages })
      await MessagesRepository.publish(message)
    } else {
      await ContactsRepository.hydrate()
    }
  }
}

class TeamListener extends React.Component {
  constructor () {
    super()
    this.state = {
      client: null,
      connected: false
    }
  }

  componentDidMount () {
    this.mounted = true
    this.connect()
  }

  componentWillUnmount () {
    this.mounted = false
    this.disconnect()
  }

  async connect () {
    if (!window.ActionheroWebsocketClient) { return } //eslint-disable-line

    const sessionResponse = await SessionRepository.get()
    if (sessionResponse && sessionResponse.team) {
      await this.setState({ team: sessionResponse.team })
    } else { return }

    const client = new ActionheroWebsocketClient() //eslint-disable-line

    const messageHandler = this.handleMessage.bind(this)

    client.on('connected', () => { if (this.mounted) { this.setState({ connected: true }) } })
    client.on('disconnected', () => { if (this.mounted) { this.setState({ connected: false }) } })
    client.on('error', (error) => {
      console.error(error)
      ErrorRepository.set({ error: `WS ${error}` })
    })
    client.on('say', (message) => { messageHandler(message) })

    await this.setState({ client })

    await this.state.client.connect()
    this.state.client.roomAdd(`team:${this.state.team.id}`, (response) => {
      if (response.error) { ErrorRepository.set({ error: `WS ${response.error}` }) }
    })
  }

  disconnect () {
    const { client } = this.state
    if (client) {
      client.disconnect()
    }
  }

  async handleMessage ({ message }) {
    console.log({ mounted: this.mounted, connected: this.state.connected })
    if (message && (message.type === 'message' || message.type === 'note')) {
      const repository = new MessagesRepositoryForWS()
      await repository.appendForTeam(message)
    }
  }

  render () {
    const { connected } = this.state
    let variant = 'danger'
    if (connected) { variant = 'success' }

    return <p>ws: <Badge variant={variant}>{connected ? 'connected' : 'disconnected'}</Badge></p>
  }
}

export default TeamListener
