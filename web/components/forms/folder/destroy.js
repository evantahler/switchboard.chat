import React from 'react'
import { Form, Button } from 'react-bootstrap'
import FormSerializer from './../utils/formSerializer'
import FolderRepository from './../../../repositories/folder'
import FoldersRepository from './../../../repositories/folders'

class DestroyFolderForm extends React.Component {
  constructor () {
    super()
    this.state = {
      validated: false,
      folder: {}
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
    const deleteReponse = await FolderRepository.destroy(data)
    if (deleteReponse) {
      await FoldersRepository.hydrate()
      return this.props.handleClose()
    }
  }

  render () {
    const { validated, folder } = this.state

    return (
      <Form
        id='form'
        onSubmit={event => this.validate(event)}
        validated={validated}
        noValidate
      >
        <Form.Group controlId='folder'>
          Are you sure you want to delete {folder.name}?
        </Form.Group>

        <Button variant='danger' type='submit'>
          Delete folder
        </Button>
      </Form>
    )
  }
}

export default DestroyFolderForm
