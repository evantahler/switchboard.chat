import React from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import MessageRepository from './../../../repositories/message'

class MessageAddForm extends React.Component {
  constructor () {
    super()
    this.state = {
      validated: false,
      message: '',
      file: null,
      fileName: '',
      type: 'note'
    }
  }

  validate (event) {
    const form = event.currentTarget
    const valid = form.checkValidity()
    event.preventDefault()
    event.stopPropagation()
    this.setState({ validated: true })
    if (valid) { this.submit() }
  }

  async submit () {
    const data = Object.assign({}, this.state)
    delete data.validated
    await MessageRepository.create(data)
    this.setState({ message: '', validated: false })
  }

  render () {
    const { validated, message, fileName } = this.state

    const updateMessage = async (event) => {
      this.state[event.target.id] = event.target.value
      this.setState(this.state)
    }

    return (
      <Form
        id='form'
        onSubmit={event => this.validate(event)}
        validated={validated}
        noValidate
      >
        <Form.Group controlId='message'>
          <Form.Label>Message</Form.Label>
          <Form.Control autoFocus required type='text' placeholder='message' value={message} onChange={e => updateMessage(e)} />
          <Form.Control.Feedback type='invalid'>Message is required</Form.Control.Feedback>
        </Form.Group>

        <Row>
          <Col>
            <Button className='float-left' variant='outline-primary' size='md' type='submit'>{`Add Note`}</Button>
          </Col>
        </Row>

      </Form>
    )
  }
}

export default MessageAddForm
