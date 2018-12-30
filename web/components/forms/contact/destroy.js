import React from 'react'
import { Form, Button } from 'react-bootstrap'
import FormSerializer from './../utils/formSerializer'
import ContactRepository from './../../../repositories/contact'
import ContactsRepository from './../../../repositories/contacts'

class EditContactForm extends React.Component {
  constructor () {
    super()
    this.state = {
      validated: false,
      contact: {}
    }
  }

  async componentDidMount () {
    await this.load()
  }

  async load () {
    const { contact } = await ContactRepository.get()
    this.setState({ contact })
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
    data.contactId = this.state.contact.id
    data.folderId = this.state.contact.folderId
    const deleteReponse = await ContactRepository.destroy(data)
    if (deleteReponse) {
      await ContactsRepository.hydrate()
      return this.props.handleClose()
    }
  }

  render () {
    const { validated, contact } = this.state

    return (
      <Form
        id='form'
        onSubmit={event => this.validate(event)}
        validated={validated}
        noValidate
      >
        <Form.Group controlId='contact'>
          Are you sure you want to delete {contact.firstName} {contact.lastName}?
        </Form.Group>

        <Button variant='danger' type='submit'>
          Delete Contact
        </Button>
      </Form>
    )
  }
}

export default EditContactForm
