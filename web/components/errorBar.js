import React from 'react'
import { Row, Col, Alert } from 'react-bootstrap'
import ErrorRepository from './../repositories/error'

class ErrorBar extends React.Component {
  constructor () {
    super()
    this.state = {
      show: true,
      error: null
    }
  }

  componentDidMount () {
    ErrorRepository.subscribe('error-bar', this.subscription.bind(this))
  }

  componentWillUnmount () {
    ErrorRepository.unsubscribe('error-bar')
  }

  subscription ({ error }) {
    this.setState({ error, show: true })
  }

  format (error) {
    return (error).toString()
  }

  handleHide () { this.setState({ show: false, error: null }) }
  handleShow () { this.setState({ show: true }) }

  render () {
    const error = this.state.error
    if (!error) { return null }

    const formattedError = this.format(error)

    return (
      <Row>
        <Col>
          <Alert
            show={this.state.show}
            onClose={this.handleHide.bind(this)}
            dismissible
            variant='danger'
          >
            {formattedError}
          </Alert>
        </Col>
      </Row>
    )
  }
}

export default ErrorBar
