import React from 'react'
import Router from 'next/router'
import { Card, ButtonToolbar, Button, Alert } from 'react-bootstrap'
import TeamsRepository from './../../repositories/teams'
import SessionRepository from './../../repositories/session'
import ContactsRepository from './../../repositories/contacts'
import ContactRepository from './../../repositories/contact'
import MessagesRepository from './../../repositories/messages'
import MessageRepository from './../../repositories/message'
import FoldersRepository from './../../repositories/folders'
import TeamMemberRepository from './../../repositories/teamMember'
import TeamMembersRepository from './../../repositories/teamMembers'

class TeamCard extends React.Component {
  async goToTeam (team, subpath = '') {
    await ContactsRepository.remove()
    await ContactRepository.remove()
    await MessagesRepository.remove()
    await MessageRepository.remove()
    await FoldersRepository.remove()
    await TeamMemberRepository.remove()
    await TeamMembersRepository.remove()

    const session = await SessionRepository.get()
    session.team = team
    await SessionRepository.set(session)
    Router.push(`/team${subpath}`)
  }

  render () {
    const team = this.props.team

    return (
      <Card>
        <Card.Header><h3>{team.name}</h3></Card.Header>
        <Card.Body>
          <Card.Title>{team.phoneNumber}</Card.Title>
          <Card.Text>
            Total Messages In: {team.stats.messagesIn}<br />
            Total Messages Out: {team.stats.messagesOut}<br />
          </Card.Text>
          <ButtonToolbar>
            <Button variant='primary' onClick={this.goToTeam.bind(this, team, '/stream')}>Go to to {team.name}</Button>
            &nbsp;
            <Button variant='outline-warning' onClick={this.goToTeam.bind(this, team, '/members')}>Team Members</Button>
            &nbsp;
            <Button variant='outline-info' onClick={this.goToTeam.bind(this, team, '/edit')}>Edit Team</Button>
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
    const { teams } = this.state

    return (
      <div>
        {teams.length > 0
          ? teams.map((team) => { return <TeamCard key={`team-${team.id}`} team={team} /> })
          : <Alert variant='warning'>You are not yet a member of any teams.  You can create a new team.</Alert>}
      </div>
    )
  }
}

export default TeamsList
