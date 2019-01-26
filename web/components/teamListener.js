import React from 'react'
import { Badge } from 'react-bootstrap'
import ContactsRepository from './../repositories/contacts'
import SessionRepository from './../repositories/session'

class TeamListener extends React.Component {
  constructor () {
    super()
    this.state = {
      lastCheck: null,
      sleep: 1000 * 30,
      renderTimer: null,
      fetchTimer: null,
      _tick: null
    }
  }

  async componentDidMount () {
    await this.poll()
    const fetchTimer = setInterval(this.poll.bind(this), this.state.sleep)
    const renderTimer = setInterval(this.tick.bind(this), 1000)
    this.setState({ fetchTimer, renderTimer })
  }

  componentWillUnmount () {
    clearInterval(this.state.renderTimer)
    clearInterval(this.state.fetchTimer)
  }

  tick () {
    this.setState({ _tick: new Date() })
  }

  async poll () {
    const sessionResponse = await SessionRepository.get()
    if (sessionResponse && sessionResponse.team) {
      await ContactsRepository.hydrate()
    }
    this.setState({ lastCheck: new Date() })
  }

  render () {
    const { lastCheck, sleep } = this.state
    if (!lastCheck) { return null }

    const now = new Date()
    const secondsRemaining = Math.floor((sleep - (now.getTime() - lastCheck.getTime())) / 1000)
    return <p>polling: <Badge variant='primary'>{secondsRemaining}s</Badge></p>
  }
}

export default TeamListener
