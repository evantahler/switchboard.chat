import React from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import MessageRepository from './../../../repositories/message'

class MessageAddForm extends React.Component {
  constructor () {
    super()
    this.state = {
      validated: false,
      type: 'message',
      message: '',
      file: null,
      fileName: ''
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
    let data = Object.assign({}, this.state)
    delete data.validated
    await MessageRepository.create(data)
    this.setState({ message: '', validated: false })
  }

  render () {
    const { validated, message, type, fileName } = this.state

    const updateMessage = async (event) => {
      this.state[event.target.id] = event.target.value
      this.setState(this.state)
    }

    const updateFile = async (event) => {
      this.state.file = event.target.files[0]
      this.state.fileName = event.target.value
      await this.setState(this.state)
    }

    const updateCheck = async (event) => {
      const state = this.state
      if (event.target.checked) { state.type = 'note' } else { state.type = 'message' }
      this.setState(state)
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
          <Col md={4}>
            <Form.Group controlId='file'>
              <Form.Control type='file' placeholder='Add Attachment' value={fileName} onChange={e => updateFile(e)} />
            </Form.Group>

            <Button className='float-left' variant='outline-primary' size='sm' type='submit'>{`Send ${type}`}</Button>
          </Col>
          <Col md={4} />
          <Col md={4}>
            <Form.Group className='float-right' controlId='sendAsText'>
              <Form.Check type='checkbox' label='Save as note' onChange={e => updateCheck(e)} />
            </Form.Group>
          </Col>
        </Row>

      </Form>
    )
  }
}

export default MessageAddForm
