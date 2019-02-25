import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { Form, Button } from 'react-bootstrap'
import FormSerializer from './../utils/formSerializer'
import SessionRepository from './../../../repositories/session'
import UserRepository from './../../../repositories/user'

class SignUpForm extends React.Component {
  constructor () {
    super()
    this.state = {
      validated: false
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
    const data = FormSerializer(form)
    const sessionData = await SessionRepository.create(data)
    if (!sessionData) { return }
    const user = await UserRepository.get(sessionData)
    if (user) { Router.push('/user/teams') }
  }

  render () {
    const { validated } = this.state

    return (
      <>
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

          <Button variant='primary' type='submit'>
            Submit
          </Button>
        </Form>

        <br />
        <Link href='/session/request-password-reset'><a>Forgot your password?</a></Link>
      </>
    )
  }
}

export default SignUpForm
