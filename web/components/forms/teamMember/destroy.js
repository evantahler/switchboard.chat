import React from 'react'
import { Form, Button } from 'react-bootstrap'
import FormSerializer from './../utils/formSerializer'
import TeamMemberRepository from './../../../repositories/teamMember'
import TeamMembersRepository from './../../../repositories/teamMembers'

class DestroyTeamMemberForm extends React.Component {
  constructor () {
    super()
    this.state = {
      validated: false,
      teamMember: {}
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
    const deleteReponse = await TeamMemberRepository.destroy(data)
    if (deleteReponse) {
      await TeamMembersRepository.hydrate()
      return this.props.handleClose()
    }
  }

  render () {
    const { validated, teamMember } = this.state

    return (
      <Form
        id='form'
        onSubmit={event => this.validate(event)}
        validated={validated}
        noValidate
      >
        <Form.Group controlId='teamMember'>
          Are you sure you want to remove {teamMember.firstName} {teamMember.lastName} from this team?
        </Form.Group>

        <Button variant='danger' type='submit'>
          Delete Team Member
        </Button>
      </Form>
    )
  }
}

export default DestroyTeamMemberForm
