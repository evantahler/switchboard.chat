import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import DestroyFolderForm from '../../forms/folder/destroy.js'
import ErrorAlert from './../../alerts/error'
import FolderRepository from './../../../repositories/folder'

class DestroyFoldertModal extends React.Component {
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
        <Button variant='outline-danger' size='sm' onClick={this.handleShow}>X</Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Destroy Folder</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ErrorAlert />
            <DestroyFolderForm handleClose={this.handleClose} />
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

export default DestroyFoldertModal
