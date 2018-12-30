import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import DestroyContactForm from '../../forms/contact/destroy.js'
import ErrorAlert from './../../alerts/error'

class DeleteContactModal extends React.Component {
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
        <Button variant='outline-danger' size='sm' onClick={this.handleShow}>X</Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Contact</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ErrorAlert />
            <DestroyContactForm handleClose={this.handleClose} />
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

export default DeleteContactModal
