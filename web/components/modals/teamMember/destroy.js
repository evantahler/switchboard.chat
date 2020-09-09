import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import DestroyTeamMemberForm from '../../forms/teamMember/destroy.js'
import TeamMemberRepository from './../../../repositories/teamMember'
import ErrorAlert from './../../alerts/error'

class DestroyTeamMemberModal extends React.Component {
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
    await this.setTeamMember`()`
    this.setState({ show: true })
  }

  handleClose () {
    this.setState({ show: false })
  }

  render () {
    return (
      <>
        <Button variant='outline-danger' size='sm' onClick={this.handleShow}>X</Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Destroy Team Member</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ErrorAlert />
            <DestroyTeamMemberForm handleClose={this.handleClose} />
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

export default DestroyTeamMemberModal
