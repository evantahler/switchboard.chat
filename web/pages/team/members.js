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
      <Layout>
        <h1>{team.name} Team Members</h1>
        <br />
        <Row>
          <Col>
            <TeamMembersList />
          </Col>
          <Col>
            <AddTeamMemberForm />
          </Col>
        </Row>

      </Layout>
    )
  }
}

export default Page
