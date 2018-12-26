import React from 'react'
import Router from 'next/router'
import { Card, Button, Alert } from 'react-bootstrap'
import TeamsRepository from './../../repositories/teams'
import SessionRepository from './../../repositories/session'

class TeamCard extends React.Component {
  async setTeam (team) {
    let session = await SessionRepository.get()
    session.team = team
    console.log('set', session)
    await SessionRepository.set(session)
    Router.push('/team')
  }

  render () {
    const team = this.props.team

    return (
      <Card>
        <Card.Header>{team.name}</Card.Header>
        <Card.Body>
          <Card.Title>{team.phoneNumber}</Card.Title>
          <Card.Text>
            Messages In: {team.stats.messagesIn}<br />
            Messages Out: {team.stats.messagesOut}<br />
            Price per Month: {team.pricePerMonth}<br />
            Price per Message: {team.pricePerMessage}<br />
            Included Messages per Month: {team.includedMessagesPerMonth}<br />
          </Card.Text>
          <Button variant='primary' onClick={this.setTeam.bind(this, team)}>Go to to {team.name}</Button>
        </Card.Body>
      </Card>
    )
  }
}

class TeamsList extends React.Component {
  constructor () {
    super()
    this.state = { teams: [] }
  }

  async componentDidMount () {
    return this.load()
  }

  async load () {
    const response = await TeamsRepository.get()
    if (response) { this.setState({ teams: response.teams }) }
  }

  render () {
    const teams = this.state.teams

    return (
      <div>
        { teams.length > 0
          ? teams.map((team) => { return <TeamCard key={`team-${team.id}`} team={team} /> })
          : <Alert variant='warning'>You are not yet a member of any teams.  You can create a new team.</Alert>
        }
      </div>
    )
  }
}

export default TeamsList
