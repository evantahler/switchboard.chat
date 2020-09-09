import React from 'react'
import { Row, Col } from 'react-bootstrap'
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
              <a target='_new' href='/support'>Need Help?</a><br />
              version {this.state.version.version}
            </p>
          </Col>
          <Col
            md={6} style={{
              textAlign: 'right'
            }}
          >
            <p>{this.copyright()} <a target='_new' href='https://www.delicioushat.com'>Delicious Hat</a></p>
          </Col>
        </Row>
      </footer>
    )
  }
}

export default Footer
