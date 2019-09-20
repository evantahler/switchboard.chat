import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import Layout from './../components/layouts/loggedOut.js'
import { Jumbotron, Button, Row, Col, Card } from 'react-bootstrap'
import WhatIsSwitchboardCard from './../components/cards/whatIsSwitchboard'
import HowDoesSwitchboardWorkCard from './../components/cards/howDoesSwitchboardWork'
import FeaturesTable from './../components/lists/features'

class IndustryCard extends React.Component {
  render () {
    const slug = this.props.title.replace(' ', '-').toLowerCase()
    const link = `/industries/${slug}`
    const image = `/static/images/cards/${slug}.jpg`

    return (
      <Card border='info' style={{
        minHeight: 200,
      }}>
        <Card.Img variant='top' src={image} />
        <Card.Body>
          <Card.Title style={{ textAlign: 'center' }}><Link href={link}><a>{this.props.title}</a></Link></Card.Title>
        </Card.Body>
      </Card>
    )
  }
}

class Page extends React.Component {
  render () {
    const jumbotronStyle = {
      backgroundImage: 'url("/static/images/hero.jpg")',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      minHeight: 500,
      color: 'white'
    }

    return (
      <Layout>
        <Jumbotron style={jumbotronStyle}>
          <Row>
            <Col md={12}>
              <h1>Switchboard:</h1>
              <h2>Centralized SMS Communication for Teams</h2>
              <p>
                <br />
                Sign up to move all of your team's text messages to one easy-to-use place.
              </p>
            </Col>
          </Row>
          <Row style={{ paddingTop: 200 }}>
            <Col md={12}>
              <div>
                <Button size='lg' variant='success' onClick={() => Router.push('/session/sign-up')}>Sign Up</Button>
                &nbsp;
                &nbsp;
                <Button size='lg' variant='info' onClick={() => Router.push('/session/sign-in')}>Sign In</Button>
              </div>
            </Col>
          </Row>
        </Jumbotron>

        <Row>
          <Col md={12}>
            <h2>What is Switchboard?</h2>
            <WhatIsSwitchboardCard />
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

        <br />

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
