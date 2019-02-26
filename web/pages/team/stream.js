import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Layout from './../../components/layouts/loggedIn.js'
import TeamListener from './../../components/teamListener.js'
import FoldersList from './../../components/lists/folders.js'
import Stream from './../../components/lists/stream.js'

class Page extends React.Component {
  render () {
    return (
      <Layout>
        <br />
        <Row>
          <Col md={3}>
            <h2>Stream</h2>
            <FoldersList />
          </Col>
          <Col md={9}>
            <Stream />
          </Col>
        </Row>
        <br />
        <TeamListener />
      </Layout>
    )
  }
}

export default Page
