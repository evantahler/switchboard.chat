import React from 'react'
import { Form, Button } from 'react-bootstrap'
import FormSerializer from './../utils/formSerializer'
import TeamMemberRepository from './../../../repositories/teamMember'
import TeamMembersRepository from './../../../repositories/teamMembers'

class EditTeamMemberForm extends React.Component {
  constructor () {
    super()
    this.state = {
      validated: false,
      folders: [],
      teamMember: {
        id: -1,
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
      }
    }
  }

  async componentDidMount () {
    await this.load()
  }

  async load () {
    const { teamMember } = await TeamMemberRepository.get()
    if (!teamMember) { return }
    this.setState({ teamMember })
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
    data.userId = this.state.teamMember.id
    const saveResponse = await TeamMemberRepository.update(data)
    if (saveResponse) {
      await TeamMembersRepository.hydrate()
      return this.props.handleClose()
    }
  }

  render () {
    const { validated, teamMember } = this.state

    const update = async (event) => {
      teamMember[event.target.id] = event.target.value
      this.setState({ teamMember })
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
          <Form.Control autoFocus required type='text' placeholder='First' value={teamMember.firstName} onChange={e => update(e)} />
          <Form.Control.Feedback type='invalid'>First name is required</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId='lastName'>
          <Form.Label>Last Name</Form.Label>
          <Form.Control required type='text' placeholder='Last' value={teamMember.lastName} onChange={e => update(e)} />
          <Form.Control.Feedback type='invalid'>Last name is required</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control required type='tel' placeholder='xxx-xxxx' value={teamMember.email} onChange={e => update(e)} />
          <Form.Control.Feedback type='invalid'>Email is required</Form.Control.Feedback>
        </Form.Group>

        <Button variant='primary' type='submit'>
          Edit Contact
        </Button>
      </Form>
    )
  }
}

export default EditTeamMemberForm
