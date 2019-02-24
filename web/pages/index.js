import React from 'react'
import Router from 'next/router'
import Layout from './../components/layouts/loggedOut.js'
import { Jumbotron, Button, Row, Col, Card } from 'react-bootstrap'
import WhatIsSwitchboardCard from './../components/cards/whatIsSwitchboard'
import HowDoesSwitchboardWorkCard from './../components/cards/howDoesSwitchboardWork'
import FeaturesTable from './../components/lists/features'

class IndustryCard extends React.Component {
  render () {
    return (
      <Card border='info'>
        <Card.Body>
          <Card.Title>{this.props.title}</Card.Title>
          <Card.Text>
          </Card.Text>
        </Card.Body>
      </Card>
    )
  }
}

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
          <Col md={6}>
            <WhatIsSwitchboardCard />
          </Col>
          <Col md={6}>
            <HowDoesSwitchboardWorkCard />
          </Col>
        </Row>
        <Row>
          <Col>
            <br />
            <h2>Features</h2>
            <FeaturesTable />
          </Col>
        </Row>
        <Row>
          <Col>
            <br />
            <h2>Industries</h2>
            <p>Learn more how Switchboard can help your industry:</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <IndustryCard title={'Education'} />
          </Col>
          <Col>
            <IndustryCard title={'Real Estate'} />
          </Col>
          <Col>
            <IndustryCard title={'Logistics'} />
          </Col>
        </Row>
      </Layout>
    )
  }
}

export default Page
