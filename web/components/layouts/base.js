import React from 'react'
import Head from 'next/head'
import { Container, Row, Col } from 'react-bootstrap'
import renderEmojiAsFavicon from './../../scripts/renderEmojiAsFavicon'

const baseTitle = 'Switchboard.Chat'

class PageBase extends React.Component {
  constructor (props) {
    super(props)
    const pageTitle = props.pageTitle ? `${baseTitle} - ${props.pageTitle}` : baseTitle

    this.state = { pageTitle }
  }

  header () {
    return (
      <Head>
        <meta name='viewport' content='width=device-width' />
        <link rel='icon' data-emoji='☎️' type='image/png' />
        <link rel='stylesheet' type='text/css' href='/static/css/bootstrap.min.css' />
        <title>{this.state.pageTitle}</title>
      </Head>
    )
  }

  async componentDidMount () {
    await renderEmojiAsFavicon()
  }

  render () {
    return (
      <div>
        { this.header() }
        <br />
        <Container>
          <Row>
            <Col>
              { this.props.children }
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default PageBase
