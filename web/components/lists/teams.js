import React from 'react'
import Router from 'next/router'
import { Card, ButtonToolbar, Button, Alert } from 'react-bootstrap'
import TeamsRepository from './../../repositories/teams'
import SessionRepository from './../../repositories/session'
import ContactsRepository from './../../repositories/contacts'
import ContactRepository from './../../repositories/contact'
import MessagesRepository from './../../repositories/messages'
import FoldersRepository from './../../repositories/folders'

class TeamCard extends React.Component {
  async goToTeam (team, subpath = '') {
    await ContactsRepository.remove()
    await ContactRepository.remove()
    await MessagesRepository.remove()
    await FoldersRepository.remove()

    let session = await SessionRepository.get()
    session.team = team
    await SessionRepository.set(session)
    Router.push(`/team${subpath}`)
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
          <ButtonToolbar>
            <Button variant='primary' onClick={this.goToTeam.bind(this, team, '')}>Go to to {team.name}</Button>
            &nbsp;
            <Button variant='info' onClick={this.goToTeam.bind(this, team, '/edit')}>Edit Team</Button>
          </ButtonToolbar>
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
