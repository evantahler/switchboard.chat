import React from 'react'
import Link from 'next/link'
import { Form, Button } from 'react-bootstrap'
import FormSerializer from './../utils/formSerializer'
import SessionRepository from './../../../repositories/session'

class RequestPasswordResetForm extends React.Component {
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
    await SessionRepository.requestPasswordReset(data)
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

          <Button variant='primary' type='submit'>
            Submit
          </Button>
        </Form>

        <br />
        <Link href='/session/sign-in'><a>... or sign in</a></Link>
      </>
    )
  }
}

export default RequestPasswordResetForm
