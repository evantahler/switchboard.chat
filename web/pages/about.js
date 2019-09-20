import React from 'react'
import Layout from './../components/layouts/loggedOut.js'
import { Row, Col } from 'react-bootstrap'
import JumboImage from '../components/jumboImage'

class Page extends React.Component {
  render () {
    return (
      <Layout>
        <h1>About Switchboard</h1>
        <JumboImage src='/static/images/headers/about.jpg' />
        <Row>
          <Col md={8}>
            <h2>Origin Story</h2>

            <p>
              <a href='http://evantahler.com'>Evan</a> initially created Switchboard for his wife Christina, while she was workign as a  preschool administrator.  She was looking for a better way for teachers to communicate unplanned absences and to contact substitute teachers. She dreamed for there to be a way to reach teachers (even those without smartphones) that did not necessitate using her personal cell phone. She also wanted a way for other school administrators to be able to view and help facilitate the staffing processes. Subscribing to the mantra of "happy wife happy life", Evan created switchboard.chat to make this dream a reality.
            </p>

            <p>
              Growing from those beginings, we've learend that there are many industries that still rely on SMS communications between employees, and are doing so by physically sharing phones.  This tool aims to make it easier for the managers of those teams to work with the tool they already use (text-messaging) but gain some control, centralization, and logging.  Switchboard aims to provide a cost-effective, sharable alternative to purchasing employee phones.
            </p>
          </Col>
          <Col md={4}>
            <h2>Thank You</h2>
            <p>Asset Credits:</p>
            <ul>
              <li><a href='https://bootswatch.com'>BootSwatch</a></li>
              <li><a href='https://www.unsplash.com'>Unsplash</a></li>
            </ul>

            <p>Software Credits:</p>
            <ul>
              <li><a href='http://www.actionherojs.com'>Actionhero</a></li>
              <li><a href='https://reactjs.org/'>React</a></li>
              <li><a href='http://getbootstrap.com'>Bootstrap</a></li>
              <li><a href='https://react-bootstrap.github.io'>React Bootstrap</a></li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Terms</h2>
            <p>Coming Soon.</p>

            <h2>Privacy Policy</h2>
            <p>Coming Soon.</p>

            <h2>Billing Policy</h2>
            <p>Coming Soon.</p>
          </Col>
        </Row>
      </Layout>
    )
  }
}

export default Page
