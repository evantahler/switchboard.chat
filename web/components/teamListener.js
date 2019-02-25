import React from 'react'
import { Badge } from 'react-bootstrap'
import Client from './../client/client'
import ContactsRepository from './../repositories/contacts'
import SessionRepository from './../repositories/session'
import ContactRepository from './../repositories/contact'
import MessagesRepository from './../repositories/messages'
import TasksRepository from './../repositories/tasks'

class TeamListener extends React.Component {
  constructor () {
    super()
    this.state = {
      status: 'disconnected',
      client: null,
      httpCleint: new Client()
    }
  }

  async componentDidMount () {
    const client = new ActionheroWebsocketClient() //eslint-disable-line

    this.setState({ client })
    client.connect()

    client.on('connected', () => this.setState({ status: 'connected' }))
    client.on('disconnected', () => this.setState({ status: 'disconnected' }))
    client.on('reconnect', () => this.setState({ status: 'reconnect' }))
    client.on('reconnecting', () => this.setState({ status: 'reconnecting' }))
    client.on('error', (error) => { console.error(error) })

    client.on('connected', () => { this.joinRoom() })
    client.on('say', (message) => { this.update(message) })
  }

  componentWillUnmount () {
    const { client } = this.state
    client.removeAllListeners('connected')
    client.removeAllListeners('disconnected')
    client.removeAllListeners('reconnect')
    client.removeAllListeners('reconnecting')
    client.removeAllListeners('error')
    client.removeAllListeners('say')
    client.disconnect()
  }

  async joinRoom (message) {
    const { client, httpCleint } = this.state
    const sessionResponse = await SessionRepository.get()

    if (sessionResponse && sessionResponse.team) {
      await httpCleint.action('put', '/api/team/associate', {
        websocketConnectionFingerprint: client.id,
        csrfToken: sessionResponse.csrfToken,
        teamId: sessionResponse.team.id
      })

      client.roomAdd(`team-${sessionResponse.team.id}`, ({ error }) => {
        if (error) { console.error(error) }
      })
    }
  }

  async update (message) {
    // TODO: chose what to check based on message content
    // console.log(message)

    const sessionResponse = await SessionRepository.get()
    if (sessionResponse && sessionResponse.team) {
      await ContactsRepository.hydrate()
    }

    const contactResponse = await ContactRepository.get()
    if (sessionResponse && sessionResponse.team && contactResponse && contactResponse.contact) {
      await MessagesRepository.hydrate()
      await TasksRepository.hydrate()
    }

    // check again to see new read-at counts
    if (sessionResponse && sessionResponse.team) {
      await ContactsRepository.hydrate()
    }
  }

  render () {
    const { status } = this.state
    let variant = 'warning'
    if (status === 'connected') { variant = 'primary' }

    return <p><Badge variant={variant}>{status}</Badge></p>
  }
}

export default TeamListener
