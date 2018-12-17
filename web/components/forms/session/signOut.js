import React from 'react'
import Router from 'next/router'
import Client from './../../../client/client'
import ErrorRepository from './../../../repositories/error'

const client = new Client()

class SignOutForm extends React.Component {
  componentDidMount () {
    this.submit()
  }

  async submit (form) {
    try {
      await client.action('delete', '/api/session')
      Router.push('/')
    } catch (error) {
      ErrorRepository.set(error)
    }
  }

  render () {
    return null
  }
}

export default SignOutForm
