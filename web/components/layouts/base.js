import React from 'react'
import Head from 'next/head'
import { Container, Row, Col } from 'react-bootstrap'
import GoogleAnalytics from './../googleAnalytics'
import SuccessAlert from './../alerts/success'
import ErrorAlert from './../alerts/error'

const baseTitle = 'Switchboard'

class PageBase extends React.Component {
  constructor (props) {
    super(props)
    const pageTitle = props.pageTitle ? `${baseTitle} - ${props.pageTitle}` : baseTitle
    this.state = { pageTitle }
  }

  handleError (error) {
    this.setState({ error })
  }

  header () {
    return (
      <Head>
        <meta name='viewport' content='width=device-width' />
        <link rel='apple-touch-icon' sizes='180x180' href='/static/favicon/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/static/favicon/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/static/favicon/favicon-16x16.png' />
        <link rel='stylesheet' type='text/css' href='/static/css/bootstrap.min.css' />
        <script src='https://js.stripe.com/v3/' />
        <script src={`${process.env.API_URL}/public/javascript/ActionheroWebsocketClient.min.js`} />
        <title>{this.state.pageTitle}</title>
      </Head>
    )
  }

  render () {
    return (
      <div>
        { this.header() }
        <SuccessAlert />
        <ErrorAlert />
        <br />
        <Container>
          <Row>
            <Col>
              { this.props.children }
            </Col>
          </Row>
        </Container>
        <GoogleAnalytics />
      </div>
    )
  }
}

export default PageBase
