import React from 'react'
import { Row, Col, Alert } from 'react-bootstrap'
import SuccessRepository from './../../repositories/success'

class ErrorAlert extends React.Component {
  constructor () {
    super()
    this.state = {
      show: true,
      message: null
    }
  }

  componentDidMount () {
    SuccessRepository.subscribe('success-alert', this.subscription.bind(this))
  }

  componentWillUnmount () {
    SuccessRepository.unsubscribe('success-alert')
  }

  subscription ({ message }) {
    this.setState({ message, show: true })
  }

  format (message) {
    return (message).toString()
  }

  handleHide () { this.setState({ show: false, message: null }) }
  handleShow () { this.setState({ show: true }) }

  render () {
    const message = this.state.message
    if (!message) { return null }

    const formattedMessage = this.format(message)

    return (
      <Row>
        <Col>
          <Alert
            show={this.state.show}
            onClose={this.handleHide.bind(this)}
            dismissible
            variant='success'
          >
            {formattedMessage}
          </Alert>
        </Col>
      </Row>
    )
  }
}

export default ErrorAlert
