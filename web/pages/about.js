import React from 'react'
import Layout from './../components/layouts/loggedOut.js'
import { Row, Col } from 'react-bootstrap'

class Page extends React.Component {
  render () {
    return (
      <Layout>
        <h1>About</h1>
        <h4>This application is currently in β (beta)</h4>
        <Row>
          <Col md={8}>
            <h2>Who made this?</h2>

            <p>
              <a href='http://evantahler.com'>Evan</a> made this for his wife Christina, a preschool administrator who was looking for a better way for teachers to communicate unplanned absences and to contact substitute teachers. She dreamed for there to be a way to reach and be reached by teachers (even those without smartphones) that did not necessitate using her personal cell phone. She also wanted a way for other school administrators to be able to view and sometimes help facilitate the notification processes. Subscribing to the mantra of "happy wife happy life", Evan created switchboard.chat to make this dream a reality.
            </p>

            <p>
              There are many industries that still rely on SMS communications between employees, and are doing so with a shared (or personal) phones.  This tool aims to make it easier for the managers of those teams to work with the tool they already use (SMS) but gain some control, centralization, and logging.  Switchboard.chat aims to provide a cheap, sharable alternative to purchasing employee phones.
            </p>
          </Col>
          <Col md={4}>
            <h2>Credits</h2>
            <p>Asset Credits:</p>
            <ul>
              <li><a href='https://bootswatch.com'>BootSwatch</a></li>
              <li><a href='https://thenounproject.com/dergraph/collection/phone'>Phone Icon</a></li>
              <li><a href='https://thenounproject.com/search/?q=cloud&i=322'>Cloud Icon</a></li>
            </ul>

            <p>Software Credits:</p>
            <ul>
              <li><a href='http://www.actionherojs.com'>actionhero.js</a></li>
              <li><a href='https://reactjs.org/'>React</a></li>
              <li><a href='http://getbootstrap.com'>Bootstrap</a></li>
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
