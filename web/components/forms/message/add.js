import React from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import FormSerializer from './../utils/formSerializer'
import MessageRepository from './../../../repositories/message'
import MessagesRepository from './../../../repositories/messages'

class MessageAddForm extends React.Component {
  constructor () {
    super()
    this.state = {
      validated: false,
      type: 'message',
      message: ''
    }
  }

  validate (event, type) {
    const form = event.currentTarget
    const valid = form.checkValidity()
    event.preventDefault()
    event.stopPropagation()
    this.setState({ validated: true })
    if (valid) { this.submit(form, type) }
  }

  async submit (form, type) {
    const data = FormSerializer(form)

    if (this.sendAsText) { data.type = 'note' } else { data.type = 'message' }
    delete data.sendAsText

    data.type = type
    const saveResponse = await MessageRepository.create(data)
    if (saveResponse) {
      this.setState({ validated: false, message: '' })
      await MessagesRepository.hydrate()
    }
  }

  render () {
    const { validated, message } = this.state

    const update = async (event) => {
      this.state[event.target.id] = event.target.value
      this.setState(this.state)
    }

    return (
      <Form
        id='form'
        onSubmit={event => this.validate(event, 'message')}
        validated={validated}
        noValidate
      >
        <Form.Group controlId='message'>
          <Form.Label>Message</Form.Label>
          <Form.Control autoFocus required type='text' placeholder='message' value={message} onChange={e => update(e)} />
          <Form.Control.Feedback type='invalid'>Message is required</Form.Control.Feedback>
        </Form.Group>

        <Row>
          <Col md={4}>
            <Form.Group controlId='sendAsText'>
              <Form.Check type='checkbox' label='Save as note' />
            </Form.Group>

            <Button variant='outline-primary' size='sm' type='submit'>Send Message</Button>
          </Col>
        </Row>

      </Form>
    )
  }
}

export default MessageAddForm
