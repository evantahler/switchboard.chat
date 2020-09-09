import React from 'react'
import { Toast } from 'native-base'
import ErrorRepository from './../../../web/repositories/success'

class SuccessAlert extends React.Component {
  constructor () {
    super()
    this.state = {
      message: null
    }
  }

  componentDidMount () {
    ErrorRepository.subscribe('message-alert', this.subscription.bind(this))
  }

  componentWillUnmount () {
    ErrorRepository.unsubscribe('message-alert')
  }

  subscription ({ message }) {
    this.setState({ message })
    this.show()
  }

  format (message) {
    return (message).toString()
  }

  show () {
    const message = this.state.message
    if (!message) { return null }

    const formattedMessage = this.format(message)

    Toast.show({
      text: formattedMessage,
      position: 'top',
      type: 'success',
      buttonText: 'Close',
      duration: 5000
    })
  }

  render () {
    return null
  }
}

export default SuccessAlert
