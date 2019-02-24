import React from 'react'
import Router from 'next/router'

class SignOutForm extends React.Component {
  componentDidMount () {
    this.submit()
  }

  async submit (form) {
    if (window) {
      window.localStorage.clear()
    }

    Router.push('/')
  }

  render () {
    return null
  }
}

export default SignOutForm
