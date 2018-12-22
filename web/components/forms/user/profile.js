import React from 'react'
import { Form, Button } from 'react-bootstrap'
import FormSerializer from './../utils/formSerializer'
import UserRepository from './../../../repositories/user'
import SessionRepository from './../../../repositories/session'

class SignUpForm extends React.Component {
  constructor () {
    super()
    this.state = {
      validated: false,
      user: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: ''
      }
    }
  }

  async componentDidMount () {
    return this.load()
  }

  async load () {
    const sessionData = await SessionRepository.get()
    const response = await UserRepository.get(sessionData)
    if (response) {
      // we need to not null-out the password so the form element stays controlled
      let user = response.user
      user.password = ''
      user.passwordConfirm = ''
      this.setState({ user: response.user })
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
    delete data.passwordConfirm
    const sessionData = await SessionRepository.get()
    data.userId = sessionData.userId

    if (data.password && data.password !== data.passwordConfirm) {
      return alert('passwords do not match') //eslint-disable-line
    }
    if (data.password.length === 0) { delete data.password }

    await UserRepository.update(data)
    return this.load()
  }

  render () {
    const { validated, user } = this.state

    const update = async (event) => {
      user[event.target.id] = event.target.value
      this.setState({ user })
    }

    return (
      <Form
        id='form'
        onSubmit={event => this.validate(event)}
        validated={validated}
        noValidate
      >
        <Form.Group controlId='firstName'>
          <Form.Label>First Name</Form.Label>
          <Form.Control autoFocus required type='text' placeholder='First' value={user.firstName} onChange={e => update(e)} />
          <Form.Control.Feedback type='invalid'>First name is required</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId='lastName'>
          <Form.Label>Last Name</Form.Label>
          <Form.Control required type='text' placeholder='Last' value={user.lastName} onChange={e => update(e)} />
          <Form.Control.Feedback type='invalid'>Last name is required</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId='email'>
          <Form.Label>Email address</Form.Label>
          <Form.Control required type='email' placeholder='Email Address' value={user.email} onChange={e => update(e)} />
          <Form.Text className='text-muted'>We'll never share your email with anyone else.</Form.Text>
          <Form.Control.Feedback type='invalid'>Email is required</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' placeholder='Password' value={user.password} onChange={e => update(e)} />
        </Form.Group>

        <Form.Group controlId='passwordConfirm'>
          <Form.Label>Password Confirmation</Form.Label>
          <Form.Control type='password' placeholder='Password (again)' value={user.passwordConfirm} onChange={e => update(e)} />
        </Form.Group>

        <Button variant='primary' type='submit'>
          Update
        </Button>
      </Form>
    )
  }
}

export default SignUpForm
