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
      <Layout pageTitle='Logistics'>
        <Row>
          <Col>
            <h1>Switchboard for Logistics Companies</h1>
            <h2>Group Text Messaging for Shipping, Delivery, and Operations</h2>
            <JumboImage src='/static/images/headers/logistics.jpg' />
          </Col>
        </Row>

        <Row>
          <Col md={5}>
            <h2>What is Switchboard?</h2>
            <WhatIsSwitchboardCard />
          </Col>

          <Col md={7}>
            <h2>How can we help Movers, Planners, and Coordinators?</h2>
            <p>Communicating with your team in a timely way is paramount to successfully completing a job.  You know that sometimes sending text messages, photos, or videos is often the best way to share information, especially when you team is busy or in a location with spotty reception.  Stop tying all this critical infrastructure to just one phone!  Switchboard lets you use any website or mobile device to send messages to you team, and you can share this communications with supervisors, leads, and the rest of the team.</p>

            <p>Some of the things teams have used Switchboard to do:</p>
            <ListGroup>
              <ListGroup.Item>Coordinating requests with clients</ListGroup.Item>
              <ListGroup.Item>Scheduling and clearances</ListGroup.Item>
              <ListGroup.Item>Managing schedules</ListGroup.Item>
              <ListGroup.Item>Sharing job documentation and photos</ListGroup.Item>
              <ListGroup.Item>Sharing contact lists for phone chains or activities</ListGroup.Item>
              <ListGroup.Item>Logging and assigning follow-ups</ListGroup.Item>
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
