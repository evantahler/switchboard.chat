import React from 'react'
import Layout from './../components/layouts/loggedOut.js'
import { Row, Col } from 'react-bootstrap'
import JumboImage from '../components/jumboImage'
import ReactMarkdown from 'react-markdown'

class Page extends React.Component {
  static async getInitialProps () {
    const content = await require('./../../documents/terms.md')
    return { content: content.default }
  }

  render () {
    const { content } = this.props

    return (
      <Layout>
        <h1>Switchboard Terms of Service</h1>
        <JumboImage src='/static/images/headers/about.jpg' />
        <Row>
          <Col md={12}>
            <div id='policy'>
              <ReactMarkdown source={content} />
            </div>
          </Col>
        </Row>
      </Layout>
    )
  }
}

export default Page
