import React from 'react'
import { ListGroup, Alert } from 'react-bootstrap'
import Moment from 'react-moment'
import ContactRepository from './../../repositories/contact'
import TasksRepository from './../../repositories/tasks'
import EditTaskModal from './../modals/task/edit'

class TaskCard extends React.Component {
  render () {
    const task = this.props.task
    let assignment = ''
    if (task.assignedUser) { assignment = `Assigned to ${task.assignedUser.firstName} ${task.assignedUser.lastName}` }

    return (
      <ListGroup.Item>
        <p><span className='text-warning'>{task.title}</span>:</p>
        <p dangerouslySetInnerHTML={{ __html: task.description.replace(/(?:\r\n|\r|\n)/g, '<br />') }} />
        <p className='text-muted'>{assignment} <Moment fromNow ago>{task.createdAt}</Moment> ago</p>
        <EditTaskModal task={task} />
      </ListGroup.Item>
    )
  }
}

class TasksList extends React.Component {
  constructor () {
    super()
    this.state = { tasks: [], contact: {} }
  }

  async componentDidMount () {
    ContactRepository.subscribe('tasks-list', this.subscription.bind(this))
    TasksRepository.subscribe('tasks-list', this.subscription.bind(this))
    await this.load()
  }

  componentWillUnmount () {
    TasksRepository.unsubscribe('tasks-list')
  }

  async subscription () {
    await this.load()
  }

  async load () {
    const contactResponse = await ContactRepository.get()
    if (contactResponse && contactResponse.contact) {
      this.setState({ contact: contactResponse.contact })
      await TasksRepository.setKey()
      const tasksResponse = await TasksRepository.get()
      if (tasksResponse) { this.setState({ tasks: tasksResponse.tasks }) }
    }
  }

  render () {
    const { tasks, contact } = this.state

    if (!contact.id) { return null }

    return (
      <div>
        <h3>Tasks</h3>
        {
          tasks.length > 0
            ? <ListGroup>
              { tasks.map((task) => {
                return <TaskCard key={`task-${task.id}`} task={task} />
              })
              }
            </ListGroup>
            : <Alert variant='info'>No Tasks</Alert>
        }
        <br />
      </div>
    )
  }
}

export default TasksList
