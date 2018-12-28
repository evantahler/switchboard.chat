import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Layout from './../../components/layouts/loggedIn.js'
import TeamRepository from './../../repositories/team.js'
import ContactsList from './../../components/lists/contacts.js'

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
        <h1>{team.name}</h1>
        <Row>
          <Col md={4}>
            <h2>Contacts</h2>
            <ContactsList />
          </Col>

          <Col md={8}>
            <h2>Messages</h2>
          </Col>
        </Row>
      </Layout>
    )
  }
}

export default Page
