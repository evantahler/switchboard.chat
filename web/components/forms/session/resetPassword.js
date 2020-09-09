import React from 'react'
import Router from 'next/router'
import { Form, Button } from 'react-bootstrap'
import FormSerializer from './../utils/formSerializer'
import SessionRepository from './../../../repositories/session'

class ResetPasswordForm extends React.Component {
  constructor () {
    super()

    this.state = {
      validated: false,
      email: '',
      password: '',
      passwordResetToken: ''
    }
  }

  componentDidMount (prevProps) {
    if (!window.location.search) { return }
    const urlParams = new URLSearchParams(window.location.search)
    this.setState({
      email: urlParams.get('email'),
      passwordResetToken: urlParams.get('passwordResetToken')
    })
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
    const resetRessponse = await SessionRepository.updatePassword(data)
    if (resetRessponse) {
      Router.push('/session/sign-in')
    } else {
      this.setState({ password: '' })
    }
  }

  render () {
    const { validated, password, email, passwordResetToken } = this.state

    const update = async (event) => {
      const key = event.target.id
      const value = event.target.value
      const data = {}
      data[key] = value
      this.setState(data)
    }

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
            <Form.Control disabled required type='email' value={email} onChange={e => update(e)} />
            <Form.Control.Feedback type='invalid'>Email is required</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId='passwordResetToken'>
            <Form.Label>Password Reset Token</Form.Label>
            <Form.Control disabled required type='text' value={passwordResetToken} onChange={e => update(e)} />
            <Form.Control.Feedback type='invalid'>Email is required</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control autoFocus required type='password' value={password} placeholder='New Password' onChange={e => update(e)} />
            <Form.Control.Feedback type='invalid'>A password is required</Form.Control.Feedback>
          </Form.Group>

          <Button variant='primary' type='submit'>
            Submit
          </Button>
        </Form>
      </>
    )
  }
}

export default ResetPasswordForm
