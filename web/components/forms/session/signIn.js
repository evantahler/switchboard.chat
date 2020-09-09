import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { Form, Button } from 'react-bootstrap'
import FormSerializer from './../utils/formSerializer'
import SessionRepository from './../../../repositories/session'
import UserRepository from './../../../repositories/user'
import ErrorRepository from './../../../repositories/error'
import Loader from './../../loader'
import GoogleLogin from 'react-google-login'

const googleClientId = process.env.GOOGLE_CLIENT_ID

class SignUpForm extends React.Component {
  constructor () {
    super()
    this.state = {
      validated: false,
      loading: false
    }
  }

  validate (event) {
    const form = event.currentTarget
    const valid = form.checkValidity()
    event.preventDefault()
    event.stopPropagation()
    this.setState({ validated: true })
    if (valid) { this.submit(form) }
  }

  async submit (form) {
    this.setState({ loading: true })
    const data = FormSerializer(form)
    const sessionData = await SessionRepository.create(data)
    if (!sessionData) { return this.setState({ loading: false }) }
    const user = await UserRepository.get(sessionData)
    if (user) { Router.push('/user/teams') }
  }

  async responseGoogle (googleData) {
    this.setState({ loading: true })
    if (googleData.error) {
      this.setState({ loading: false })
      return ErrorRepository.set({ error: `${googleData.error}: ${googleData.details}` })
    }

    const data = {
      email: googleData.profileObj.email,
      firstName: googleData.profileObj.givenName,
      lastName: googleData.profileObj.familyName,
      idToken: googleData.tokenObj.id_token
    }

    const sessionData = await SessionRepository.create(data)
    if (!sessionData) { return this.setState({ loading: false }) }
    const user = await UserRepository.get(sessionData)
    if (user) { Router.push('/user/teams') }
  }

  render () {
    const { validated, loading } = this.state

    return (
      <>
        <div id='googleButton'>
          {
            loading
              ? <Loader />
              : <GoogleLogin
                clientId={googleClientId}
                buttonText='Log In with Google'
                onSuccess={this.responseGoogle.bind(this)}
                onFailure={this.responseGoogle.bind(this)}
                cookiePolicy={'single_host_origin'}
              />
          }
        </div>

        <hr />

        <Form
          id='form'
          onSubmit={event => this.validate(event)}
          validated={validated}
          noValidate
        >
          <Form.Group controlId='email'>
            <Form.Label>Email address</Form.Label>
            <Form.Control autoFocus required type='email' placeholder='Email Address' />
            <Form.Control.Feedback type='invalid'>Email is required</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control required type='password' placeholder='Password' />
            <Form.Control.Feedback type='invalid'>A password is required</Form.Control.Feedback>
          </Form.Group>

          {
            loading
              ? <Loader />
              : <Button variant='primary' type='submit'>Submit</Button>
          }
        </Form>

        <br />
        <Link href='/session/request-password-reset'><a>Forgot your password?</a></Link>
      </>
    )
  }
}

export default SignUpForm
