import React from 'react'
import Router from 'next/router'
import ErrorRepository from './../repositories/error'

class LoggedOutCatcher extends React.Component {
  componentDidMount () {
    ErrorRepository.subscribe('logged-out-catcher', this.subscription.bind(this))
  }

  componentWillUnmount () {
    ErrorRepository.unsubscribe('logged-out-catcher')
  }

  subscription ({ error }) {
    if (error.match(/Please log in to continue/)) {
      Router.push('/session/sign-out')
    }
  }

  render () { return null }
}

export default LoggedOutCatcher
