import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import AddContactForm from '../../forms/contact/add.js'
import ErrorAlert from './../../alerts/error'

class AddContactModal extends React.Component {
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
        <Button variant='outline-info' size='sm' onClick={this.handleShow}>+</Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Contact</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ErrorAlert />
            <AddContactForm handleClose={this.handleClose} />
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

export default AddContactModal
