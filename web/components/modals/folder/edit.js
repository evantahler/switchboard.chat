import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import EditFolderForm from '../../forms/folder/edit.js'
import ErrorAlert from './../../alerts/error'
import FolderRepository from './../../../repositories/folder'

class EditFolderModal extends React.Component {
  constructor () {
    super()

    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)

    this.state = {
      show: false
    }
  }

  handleClose () {
    this.setState({ show: false })
  }

  async handleShow () {
    await this.setFolder()
    this.setState({ show: true })
  }

  async setFolder () {
    const folder = this.props.folder
    await FolderRepository.set({ folder })
  }

  render () {
    return (
      <>
        <Button variant='outline-info' size='sm' onClick={this.handleShow}>Edit</Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Folder</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ErrorAlert />
            <EditFolderForm handleClose={this.handleClose} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}

export default EditFolderModal
