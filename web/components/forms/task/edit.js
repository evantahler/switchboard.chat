import React from 'react'
import { Form, Button } from 'react-bootstrap'
import FormSerializer from './../utils/formSerializer'
import TaskRepository from './../../../repositories/task'
import TasksRepository from './../../../repositories/tasks'
import ContactsRepository from './../../../repositories/contacts'
import MessagesRepository from './../../../repositories/messages'
import TeamMembersRepository from './../../../repositories/teamMembers'

class EditTaskForm extends React.Component {
  constructor () {
    super()
    this.state = {
      validated: false,
      teamMembers: [],
      task: {
        title: '',
        description: '',
        assignedUserId: ''
      },
      checked: false
    }
  }

  async componentDidMount () {
    await this.load()
  }

  async load () {
    const task = this.props.task
    await TaskRepository.hydrate(this.props.task)
    const { teamMembers } = await TeamMembersRepository.get()
    this.setState({ teamMembers, task })
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
    data.taskId = this.state.task.id
    if (this.state.checked) { data.completedAt = new Date() }
    const saveResponse = await TaskRepository.update(data)
    if (saveResponse) {
      await TasksRepository.hydrate()
      await ContactsRepository.hydrate()
      await MessagesRepository.hydrate()
      return this.props.handleClose()
    }
  }

  render () {
    const { validated, task, teamMembers, checked } = this.state

    const update = async (event) => {
      task[event.target.id] = event.target.value
      this.setState({ task })
    }

    return (
      <Form
        id='form'
        onSubmit={event => this.validate(event)}
        validated={validated}
        noValidate
      >
        <Form.Group controlId='assignedUserId'>
          <Form.Label>Assigned Team Member</Form.Label>
          <Form.Control value={task.assignedUserId} required as='select' onChange={e => update(e)}>
            {teamMembers.map(teamMember => {
              return <option value={teamMember.id} key={`teamMember-${teamMember.id}`}>{teamMember.firstName} {teamMember.lastName}</option>
            })}
          </Form.Control>
          <Form.Control.Feedback type='invalid'>Assugned Team Member is Required</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId='title'>
          <Form.Label>Title</Form.Label>
          <Form.Control autoFocus required type='text' placeholder='TODO' value={task.title} onChange={e => update(e)} />
          <Form.Control.Feedback type='invalid'>Title is required</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId='description'>
          <Form.Label>Description</Form.Label>
          <Form.Control required as='textarea' rows='3' placeholder='...' value={task.description} onChange={e => update(e)} />
          <Form.Control.Feedback type='invalid'>Description is required</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId='complete'>
          <Form.Check type='checkbox' label='Complete?' checked={checked} onChange={event => this.setState({ checked: event.target.checked })} />
        </Form.Group>

        <Button variant='primary' type='submit'>
          Edit Task
        </Button>
      </Form>
    )
  }
}

export default EditTaskForm
