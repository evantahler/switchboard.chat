import React from 'react'
import Router from 'next/router'
import Layout from './../components/layouts/loggedOut.js'
import { Jumbotron, Button, Row, Col } from 'react-bootstrap'
import WhatIsSwitchboardCard from './../components/cards/whatIsSwitchboard'
import HowDoesSwitchboardWorkCard from './../components/cards/howDoesSwitchboardWork'

class Page extends React.Component {
  render () {
    return (
      <Layout>
        <Jumbotron>
          <h1>Switchboard</h1>
          <p>Centralized SMS Communication for Teams</p>
          <p>
            <Button variant='success' onClick={() => Router.push('/session/sign-up')}>Sign Up</Button>
          </p>
        </Jumbotron>
        <Row>
          <Col>
            <WhatIsSwitchboardCard />
          </Col>
          <Col>
            <HowDoesSwitchboardWorkCard />
          </Col>
        </Row>
      </Layout>
    )
  }
}

export default Page
