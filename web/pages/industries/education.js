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
      <Layout pageTitle='Education'>
        <Row>
          <Col>
            <h1>Switchboard for Education</h1>
            <h2>Group Text Messaging for Schools</h2>
            <JumboImage src='/static/images/headers/education.jpg' />
          </Col>
        </Row>

        <Row>
          <Col md={5}>
            <h2>What is Switchboard?</h2>
            <WhatIsSwitchboardCard />
          </Col>

          <Col md={7}>
            <h2>How can we help Educators and Administrators?</h2>
            <p>Switchboard was started to help school administrators contact and schedule substitute teachers.  From there, we've seen Switchboard be used for many novel purposes:</p>
            <ListGroup>
              <ListGroup.Item>Coordinating facilities requests</ListGroup.Item>
              <ListGroup.Item>Organizing substitute teachers</ListGroup.Item>
              <ListGroup.Item>Emergency communications with parents or caregivers</ListGroup.Item>
              <ListGroup.Item>Auditing out-of-school communications</ListGroup.Item>
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
              <h4>Join Switchboard today to make running your school even easier!</h4>
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
