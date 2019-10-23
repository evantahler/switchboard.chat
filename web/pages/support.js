import React from 'react'
import Layout from './../components/layouts/loggedOut.js'
import { Row, Col, Card } from 'react-bootstrap'
import JumboImage from '../components/jumboImage'

class Page extends React.Component {
  render () {
    return (
      <Layout pageTitle='Support'>
        <Row>
          <Col>
            <h1>Support</h1>
            <JumboImage src='/static/images/headers/support.jpg' />
            <p>You can reach the switchboard support team via email or text-message:</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Header as='h5'>Email</Card.Header>
              <Card.Body>
                <Card.Text>
                  <a href='mailto:support@switchboard.chat'>support@switchboard.chat</a>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Header as='h5'>Phone</Card.Header>
              <Card.Body>
                <Card.Text>
                  <a href='tel:+14123019086'>+1 412 301 9086</a>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Layout>
    )
  }
}

export default Page
