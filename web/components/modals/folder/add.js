import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import AddFolderForm from '../../forms/folder/add.js'
import ErrorAlert from './../../alerts/error'

class AddFolderModal extends React.Component {
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

  handleShow () {
    this.setState({ show: true })
  }

  render () {
    return (
      <>
        <Button variant='outline-info' size='sm' onClick={this.handleShow}>Add Folder</Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Folder</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ErrorAlert />
            <AddFolderForm handleClose={this.handleClose} />
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

export default AddFolderModal
