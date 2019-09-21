import React from 'react'
import { Row, Col, Form, Button, Card, Alert } from 'react-bootstrap'
import FormSerializer from './../utils/formSerializer'
import Moment from 'react-moment'
import NotificationsRepository from './../../../repositories/notifications'
import NotificationRepository from './../../../repositories/notification'

const MEDIUMS = ['sms', 'email']
const DELAYS = [
  // ['instantly', 0],
  ['wait 1 minute', (1000 * 60 * 1)],
  ['wait 5 minutes', (1000 * 60 * 5)],
  ['wait 10 minutes', (1000 * 60 * 10)],
  ['wait 15 minutes', (1000 * 60 * 15)],
  ['wait 30 minutes', (1000 * 60 * 30)],
  ['wait 1 hour', (1000 * 60 * 60)],
  ['wait 2 hours', (1000 * 60 * 60 * 2)],
  ['wait 3 hours', (1000 * 60 * 60 * 3)],
  ['wait 4 hours', (1000 * 60 * 60 * 4)],
  ['wait 5 hours', (1000 * 60 * 60 * 5)],
  ['wait 10 hours', (1000 * 60 * 60 * 10)],
  ['wait 12 hours', (1000 * 60 * 60 * 12)],
  ['wait 1 day', (1000 * 60 * 60 * 24)],
  ['wait 2 days', (1000 * 60 * 60 * 24 * 2)],
  ['wait 3 days', (1000 * 60 * 60 * 24 * 3)]
]

class NotificationCard extends React.Component {
  constructor (props) {
    super()

    this.state = {
      notification: {},
      validated: false
    }
  }

  static getDerivedStateFromProps (nextProps) {
    if (nextProps.notification) {
      return { notification: nextProps.notification }
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
    const { notification } = this.state
    const data = FormSerializer(form)
    data.teamId = notification.team.id
    await NotificationRepository.update(data)
    await NotificationsRepository.hydrate()
  }

  render () {
    const { notification, validated } = this.state

    const update = async (event) => {
      notification[event.target.id] = event.target.value
      this.setState({ notification })
    }

    if (!notification.team) { return null }

    return (
      <Card>
        <Card.Body>
          <Card.Title>{notification.team.name}</Card.Title>
          <Form
            id='form'
            onSubmit={event => this.validate(event)}
            validated={validated}
            noValidate
          >

            <p>Last Notification Sent:&nbsp;
              {
                notification.notifiedAt ? <span><Moment fromNow ago>{notification.notifiedAt}</Moment> ago</span> : 'Never'
              }
            </p>

            <Row>
              <Col>
                <Form.Group controlId='enabled'>
                  <Form.Label>Enabled?</Form.Label>
                  <Form.Control as='select' value={notification.enabled} onChange={e => update(e)}>
                    <option value>yes</option>
                    <option value={false}>no</option>
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group controlId='medium'>
                  <Form.Label>Medium</Form.Label>
                  <Form.Control as='select' value={notification.medium} onChange={e => update(e)}>
                    {
                      MEDIUMS.map(m => {
                        return <option key={`meduium-${m}`}>{m}</option>
                      })
                    }
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group controlId='delayMiliseconds'>
                  <Form.Label>Sending Delay</Form.Label>
                  <Form.Control as='select' value={notification.delayMiliseconds} onChange={e => update(e)}>
                    {
                      DELAYS.map(delayPair => {
                        return <option value={delayPair[1]} key={`delay-${delayPair[1]}`}>{delayPair[0]}</option>
                      })
                    }
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Button variant='primary' type='submit'>
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
    )
  }
}

class NotificationsList extends React.Component {
  constructor () {
    super()
    this.state = {
      notifications: []
    }
  }

  async componentDidMount () {
    return this.load()
  }

  async load () {
    const response = await NotificationsRepository.get()
    console.log(response.notifications)
    if (response) {
      this.setState({ notifications: response.notifications })
    }
  }

  render () {
    const { notifications } = this.state

    if (notifications.length === 0) {
      return <Alert variant='warning'>You are not a member of any teams.</Alert>
    }

    return (
      <>
        {
          notifications.map(notification => {
            return <NotificationCard key={`notification-${notification.id}`} notification={notification} />
          })
        }
      </>
    )
  }
}

export default NotificationsList
