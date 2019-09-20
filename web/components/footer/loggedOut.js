import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Link from 'next/link'
import VersionRepository from './../../repositories/version'

class Footer extends React.Component {
  constructor () {
    super()
    this.state = {
      date: new Date(),
      version: {}
    }
  }

  async componentDidMount () {
    const version = await VersionRepository.get()
    if (version) { this.setState({ version }) }
  }

  copyright () {
    return String.fromCharCode(169) + ' ' + this.state.date.getFullYear()
  }

  render () {
    return (
      <footer>
        <Row>
          <Col md={6}>
            <p>
              <Link href='/about'>Privacy</Link><br />
              <Link href='/about'>Terms</Link><br />
              version {this.state.version.version}
            </p>
          </Col>
          <Col md={6} style={{
            textAlign: 'right'
          }}>
            <p>{ this.copyright() } <a target='_blank' href='https://www.delicioushat.com'>Delicious Hat</a></p>
          </Col>
        </Row>
      </footer>
    )
  }
}

export default Footer
