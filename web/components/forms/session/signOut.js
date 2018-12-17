import React from 'react'
import Router from 'next/router'
import SessionRepository from './../../../repositories/session'
import UserRepository from './../../../repositories/user'
import ErrorRepository from './../../../repositories/error'

class SignOutForm extends React.Component {
  componentDidMount () {
    this.submit()
  }

  async submit (form) {
    await SessionRepository.destroy()
    await UserRepository.remove()
    await ErrorRepository.remove()
    Router.push('/')
  }

  render () {
    return null
  }
}

export default SignOutForm
