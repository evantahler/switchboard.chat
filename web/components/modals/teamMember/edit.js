import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import EditTeamMemberForm from '../../forms/teamMember/edit.js'
import TeamMemberRepository from './../../../repositories/teamMember'
import ErrorAlert from './../../alerts/error'

class EditTeamMemberModal extends React.Component {
  constructor () {
    super()

    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)

    this.state = {
      show: false
    }
  }

  async setTeamMember () {
    const teamMember = this.props.teamMember
    await TeamMemberRepository.set({ teamMember })
  }

  async handleShow () {
    await this.setTeamMember()
    this.setState({ show: true })
  }

  handleClose () {
    this.setState({ show: false })
  }

  render () {
    return (
      <>
        <Button variant='outline-info' size='sm' onClick={this.handleShow}>Edit</Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Team Member</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ErrorAlert />
            <EditTeamMemberForm handleClose={this.handleClose} />
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

export default EditTeamMemberModal
