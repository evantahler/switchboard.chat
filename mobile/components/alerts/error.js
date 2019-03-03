import React from 'react'
import { Toast } from 'native-base'
import ErrorRepository from './../../../web/repositories/error'

class ErrorAlert extends React.Component {
  constructor () {
    super()
    this.state = {
      error: null
    }
  }

  componentDidMount () {
    ErrorRepository.subscribe('error-alert', this.subscription.bind(this))
  }

  componentWillUnmount () {
    ErrorRepository.unsubscribe('error-alert')
  }

  subscription ({ error }) {
    this.setState({ error })
    this.show()
  }

  format (error) {
    return (error).toString()
  }

  show () {
    const error = this.state.error
    if (!error) { return null }

    const formattedError = this.format(error)

    Toast.show({
      text: formattedError,
      position: 'top',
      type: 'danger',
      buttonText: 'Close',
      duration: 5000
    })
  }

  render () {
    return null
  }
}

export default ErrorAlert
