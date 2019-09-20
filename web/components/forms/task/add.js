import React from 'react'
import { Form, Button } from 'react-bootstrap'
import FormSerializer from './../utils/formSerializer'
import TaskRepository from './../../../repositories/task'
import TasksRepository from './../../../repositories/tasks'
import TeamMembersRepository from './../../../repositories/teamMembers'

class AddTaskForm extends React.Component {
  constructor () {
    super()
    this.state = {
      validated: false,
      teamMembers: [],
      task: {
        contactId: '',
        assignedUserId: '',
        title: '',
        description: ''
      }
    }
  }

  async componentDidMount () {
    await this.load()
  }

  async load () {
    const task = this.state.task
    const teamMembersResponse = await TeamMembersRepository.get()
    if (teamMembersResponse) {
      task.assignedUserId = teamMembersResponse.teamMembers[0].id
      this.setState({
        teamMembers: teamMembersResponse.teamMembers,
        task: task
      })
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
    const saveResponse = await TaskRepository.create(data)
    if (saveResponse) {
      await TasksRepository.hydrate()
      return this.props.handleClose()
    }
  }

  render () {
    const { validated, task, teamMembers } = this.state

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
            {teamMembers.map(user => {
              return <option value={user.id} key={`user-${user.id}`}>{user.firstName} {user.lastName}</option>
            })}
          </Form.Control>
          <Form.Control.Feedback type='invalid'>Folder is Required</Form.Control.Feedback>
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

        <Button variant='primary' type='submit'>
          Add Task
        </Button>
      </Form>
    )
  }
}

export default AddTaskForm
