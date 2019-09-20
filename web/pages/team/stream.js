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
        <Row>
          <Col>
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
