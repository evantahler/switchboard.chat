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
    const sessionResponse = await SessionRepository.get()
    if (sessionResponse && sessionResponse.team) {
      await this.setState({ team: sessionResponse.team })
    } else { return }

    const messageHandler = this.handleMessage.bind(this)
    const client = new ActionheroWebsocketClient() //eslint-disable-line

    client.on('connected', () => { if (this.mounted) { this.setState({ connected: true }) } })
    client.on('disconnected', () => { if (this.mounted) { this.setState({ connected: false }) } })
    client.on('error', (error) => {
      console.error(error)
      ErrorRepository.set({ error: `WS Error: ${error}` })
    })
    client.on('say', (message) => { messageHandler(message) })

    this.setState({ client })
    await client.connect()
    await client.roomAdd(`team:${this.state.team.id}`)
  }

  disconnect () {
    const { client, connected } = this.state
    if (client && connected) { client.disconnect() }
  }

  async handleMessage ({ message }) {
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
