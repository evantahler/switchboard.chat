import React from 'react'
import { Form, Button } from 'react-bootstrap'
import FormSerializer from './../utils/formSerializer'
import FolderRepository from './../../../repositories/folder'
import FoldersRepository from './../../../repositories/folders'

class EditFolderForm extends React.Component {
  constructor () {
    super()
    this.state = {
      validated: false,
      folder: {
        id: -1,
        name: ''
      }
    }
  }

  async componentDidMount () {
    await this.load()
  }

  async load () {
    const { folder } = await FolderRepository.get()
    this.setState({ folder })
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
    data.folderId = this.state.folder.id
    const saveResponse = await FolderRepository.update(data)
    if (saveResponse) {
      await FoldersRepository.hydrate()
      return this.props.handleClose()
    }
  }

  render () {
    const { validated, folder } = this.state

    const update = async (event) => {
      folder[event.target.id] = event.target.value
      this.setState({ folder })
    }

    return (
      <Form
        id='form'
        onSubmit={event => this.validate(event)}
        validated={validated}
        noValidate
      >
        <Form.Group controlId='name'>
          <Form.Label>Folder Name</Form.Label>
          <Form.Control autoFocus required type='text' placeholder='folder' value={folder.name} onChange={e => update(e)} />
          <Form.Control.Feedback type='invalid'>Folder name is required</Form.Control.Feedback>
        </Form.Group>

        <Button variant='primary' type='submit'>
          Edit Folder
        </Button>
      </Form>
    )
  }
}

export default EditFolderForm
