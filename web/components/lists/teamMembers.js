import React from 'react'
import { Card, Alert, ButtonToolbar } from 'react-bootstrap'
import SessionRepository from './../../repositories/session'
import TeamMembersRepository from './../../repositories/teamMembers'
import EditTeamMemberModal from './../modals/teamMember/edit.js'
import DestroyTeamMemberModal from './../modals/teamMember/destroy.js'

class TeamMemberCard extends React.Component {
  constructor () {
    super()
    this.state = { userId: null }
  }

  async componentDidMount () {
    const sessionResponse = await SessionRepository.get()
    if (sessionResponse) { this.setState({ userId: sessionResponse.userId }) }
  }

  render () {
    const teamMember = this.props.teamMember
    const userId = this.state.userId

    return (
      <>
        <Card>
          <Card.Header>{teamMember.firstName} {teamMember.lastName}</Card.Header>
          <Card.Body>
            <Card.Text> {teamMember.email} </Card.Text>
            {
              userId !== teamMember.id
                ? <ButtonToolbar>
                  <EditTeamMemberModal teamMember={teamMember} />
                  &nbsp;
                  <DestroyTeamMemberModal teamMember={teamMember} />
                </ButtonToolbar>
                : null
            }
          </Card.Body>
        </Card>
        <br />
      </>
    )
  }
}

class TeamMemberList extends React.Component {
  constructor () {
    super()
    this.state = { teamMembers: [] }
  }

  async componentDidMount () {
    TeamMembersRepository.subscribe('teamMembers-list', this.subscription.bind(this))
    this.load()
  }

  componentWillUnmount () {
    TeamMembersRepository.unsubscribe('teamMembers-list')
  }

  async subscription () {
    await this.load()
  }

  async load () {
    const teamMembersResponse = await TeamMembersRepository.get()
    if (teamMembersResponse) { this.setState({ teamMembers: teamMembersResponse.teamMembers }) }
  }

  render () {
    const teamMembers = this.state.teamMembers

    return (
      <div>
        {teamMembers.length > 0
          ? teamMembers.map((teamMember) => { return <TeamMemberCard key={`message-${teamMember.id}`} teamMember={teamMember} /> })
          : <Alert variant='info'>No Team Members yet</Alert>}
      </div>
    )
  }
}

export default TeamMemberList
