import React from 'react'
import { Form, Button } from 'react-bootstrap'
import FormSerializer from './../utils/formSerializer'
import ContactRepository from './../../../repositories/contact'
import ContactsRepository from './../../../repositories/contacts'
import FoldersRepository from './../../../repositories/folders'

class EditContactForm extends React.Component {
  constructor () {
    super()
    this.state = {
      validated: false,
      folders: [],
      contact: {
        id: -1,
        folderId: '',
        firstName: '',
        lastName: '',
        phoneNumber: ''
      }
    }
  }

  async componentDidMount () {
    await this.load()
  }

  async load () {
    const { contact } = await ContactRepository.get()
    const { folders } = await FoldersRepository.get()
    this.setState({ contact, folders })
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
    const saveResponse = await ContactRepository.update(data)
    if (saveResponse) {
      await ContactsRepository.hydrate()
      return this.props.handleClose()
    }
  }

  render () {
    const { validated, contact, folders } = this.state

    const update = async (event) => {
      contact[event.target.id] = event.target.value
      this.setState({ contact })
    }

    return (
      <Form
        id='form'
        onSubmit={event => this.validate(event)}
        validated={validated}
        noValidate
      >
        <Form.Group controlId='folderId'>
          <Form.Label>Folder</Form.Label>
          <Form.Control value={contact.folderId} required as='select' onChange={e => update(e)}>
            { folders.map(folder => {
              return <option value={folder.id} key={`folder-${folder.id}`}>{folder.name}</option>
            }) }
          </Form.Control>
          <Form.Control.Feedback type='invalid'>Folder is Required</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId='firstName'>
          <Form.Label>First Name</Form.Label>
          <Form.Control autoFocus required type='text' placeholder='First' value={contact.firstName} onChange={e => update(e)} />
          <Form.Control.Feedback type='invalid'>First name is required</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId='lastName'>
          <Form.Label>Last Name</Form.Label>
          <Form.Control required type='text' placeholder='Last' value={contact.lastName} onChange={e => update(e)} />
          <Form.Control.Feedback type='invalid'>Last name is required</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId='phoneNumber'>
          <Form.Label>Phone Number</Form.Label>
          <Form.Control required type='tel' placeholder='xxx-xxxx' value={contact.phoneNumber} onChange={e => update(e)} />
          <Form.Control.Feedback type='invalid'>Phone Number is required</Form.Control.Feedback>
        </Form.Group>

        <Button variant='primary' type='submit'>
          Edit Contact
        </Button>
      </Form>
    )
  }
}

export default EditContactForm
