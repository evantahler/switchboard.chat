import React from 'react'
import Router from 'next/router'
import { Row, Col, Button } from 'react-bootstrap'
import Layout from './../../components/layouts/loggedIn.js'
import TeamsList from './../../components/lists/teams'

class Page extends React.Component {
  render () {
    return (
      <Layout>
        <Row>
          <Col md={8}>
            <h1>Your Teams</h1>
            <TeamsList />
          </Col>
          <Col>
            <h1>New Team</h1>
            <p>You can be a member of many Switchboard teams.  Each team has its own phone number and contact list.</p>
            <p>Creating a new team will require a payment method.</p>
            <Button onClick={() => { Router.push('/team/new') }}>Create new Team</Button>
          </Col>
        </Row>

      </Layout>
    )
  }
}

export default Page
