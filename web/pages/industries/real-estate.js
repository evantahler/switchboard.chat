import React from 'react'
import Layout from './../../components/layouts/loggedOut.js'
import JumboImage from '../../components/jumboImage'
import Router from 'next/router'
import { Row, Col, Jumbotron, Button, ListGroup, Image } from 'react-bootstrap'
import WhatIsSwitchboardCard from '../../components/cards/whatIsSwitchboard'
import HowDoesSwitchboardWorkCard from '../../components/cards/howDoesSwitchboardWork'

class Page extends React.Component {
  render () {
    return (
      <Layout pageTitle='Real Estate'>
        <Row>
          <Col>
            <h1>Switchboard for Real Estate</h1>
            <h2>Group Text Messaging for Property Managers and Realtors</h2>
            <JumboImage src='/static/images/headers/real-estate.jpg' />
          </Col>
        </Row>

        <Row>
          <Col md={5}>
            <h2>What is Switchboard?</h2>
            <WhatIsSwitchboardCard />
          </Col>

          <Col md={7}>
            <h2>How can we help Realtors, Property Managers, and Maintenance Staff?</h2>
            <p>Communicating with your tenants is important.  Text-messaging provides a trusted and intimate channel between you and your renters... but it can be a pain if that communication is tied to your personal phone.  Switchboard provides a place to share this communication with your team, assign jobs, and handle followup communication... and for you to keep your personal phone personal.</p>

            <p>Some of the things teams have used Switchboard to do:</p>
            <ListGroup>
              <ListGroup.Item>Coordinating requests with clients</ListGroup.Item>
              <ListGroup.Item>Scheduling and Maintenance</ListGroup.Item>
              <ListGroup.Item>Managing schedules</ListGroup.Item>
              <ListGroup.Item>Sharing job documentation and photos</ListGroup.Item>
              <ListGroup.Item>Sharing contact lists for phone chains or activities</ListGroup.Item>
              <ListGroup.Item>Logging tasks and assigning follow-ups</ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>

        <br />

        <Row>
          <Col style={{ textAlign: 'center' }}>
            <Image src='/static/images/screenshots/stream.jpg' style={{ maxWidth: '90%' }} />
          </Col>
        </Row>

        <br />

        <Row>
          <Col>
            <Jumbotron style={{ textAlign: 'center' }}>
              <h4>Join Switchboard today to make running your business even easier!</h4>
              <br />
              <Button size='lg' variant='success' onClick={() => Router.push('/session/sign-up')}>Sign Up</Button>
            </Jumbotron>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <h2>How does Switchboard Work?</h2>
            <HowDoesSwitchboardWorkCard />
          </Col>
        </Row>

      </Layout>
    )
  }
}

export default Page
