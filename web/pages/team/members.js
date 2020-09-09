import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Layout from './../../components/layouts/loggedIn.js'
import TeamRepository from './../../repositories/team.js'
import TeamMembersList from './../../components/lists/teamMembers.js'
import AddTeamMemberForm from './../../components/forms/teamMember/add.js'

class Page extends React.Component {
  constructor () {
    super()
    this.state = {
      team: {}
    }
  }

  async componentDidMount () {
    const teamResponse = await TeamRepository.get()
    if (teamResponse) { this.setState({ team: teamResponse.team }) }
  }

  render () {
    const { team } = this.state

    return (
      <Layout pageTitle='Team Members'>
        <h1>{team.name} Team Members</h1>
        <br />
        <Row>
          <Col>
            <TeamMembersList />
          </Col>
          <Col>
            <h2>Add new Team Member</h2>
            <p>Switchboard users can be members of many teams.  If the Team Member you are is inviting already has an account, they will recieve an invitation.  Otherwise, they will recieve an invitation to join both Switchboard and your team.</p>
            <AddTeamMemberForm />
          </Col>
        </Row>

      </Layout>
    )
  }
}

export default Page
