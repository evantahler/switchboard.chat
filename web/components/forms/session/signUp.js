import React from 'react'
import Router from 'next/router'
import { Form, Button } from 'react-bootstrap'
import FormSerializer from './../utils/formSerializer'
import UserRepository from './../../../repositories/user'
import SessionRepository from './../../../repositories/session'

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
    if (data.password !== data.passwordConfirm) { return alert('passwords do not match') } //eslint-disable-line

    const userSuccess = await UserRepository.create(data)
    if (userSuccess) {
      const sessionSuccess = await SessionRepository.create(data)
      if (sessionSuccess) {
        Router.push('/user/teams')
      }
    }
  }

  render () {
    const { validated } = this.state

    return (
      <Form
        id='form'
        onSubmit={event => this.validate(event)}
        validated={validated}
        noValidate
      >
        <Form.Group controlId='firstName'>
          <Form.Label>First Name</Form.Label>
          <Form.Control autoFocus required type='text' placeholder='First' />
          <Form.Control.Feedback type='invalid'>First name is required</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId='lastName'>
          <Form.Label>Last Name</Form.Label>
          <Form.Control required type='text' placeholder='Last' />
          <Form.Control.Feedback type='invalid'>Last name is required</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId='email'>
          <Form.Label>Email address</Form.Label>
          <Form.Control required type='email' placeholder='Email Address' />
          <Form.Text className='text-muted'>We'll never share your email with anyone else.</Form.Text>
          <Form.Control.Feedback type='invalid'>Email is required</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control required type='password' placeholder='Password' />
          <Form.Control.Feedback type='invalid'>A password is required</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId='passwordConfirm'>
          <Form.Label>Password Confirmation</Form.Label>
          <Form.Control required type='password' placeholder='Password (again)' />
          <Form.Control.Feedback type='invalid'>You need to confirm your password</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId='terms'>
          <Form.Check required label='I Agree to the terms' feedback='You must agree to the terms' />
        </Form.Group>

        <Button variant='primary' type='submit'>
          Submit
        </Button>
      </Form>
    )
  }
}

export default SignUpForm
