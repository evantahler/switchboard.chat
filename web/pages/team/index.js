import React from 'react'
import { Row, Col, Alert } from 'react-bootstrap'
import Layout from './../../components/layouts/loggedIn.js'
import TeamListener from './../../components/teamListener.js'
import ContactsList from './../../components/lists/contacts.js'
import ContactRepository from './../../repositories/contact.js'
import FoldersRepository from './../../repositories/folders.js'
import MessagesList from './../../components/lists/messages.js'
import TasksList from './../../components/lists/tasks.js'
import AddContactModal from './../../components/modals/contact/add.js'
import EditContactModal from './../../components/modals/contact/edit.js'
import AddTaskModal from './../../components/modals/task/add.js'
import DestroyContactModal from './../../components/modals/contact/destroy.js'

class Page extends React.Component {
  constructor () {
    super()
    this.state = {
      team: {},
      contact: {},
      folders: []
    }
  }

  async componentDidMount () {
    ContactRepository.subscribe('team-index', this.subscription.bind(this))
    await this.load()
  }

  componentWillUnmount () {
    ContactRepository.unsubscribe('team-index')
  }

  async subscription () {
    await this.load()
  }

  async load () {
    const contactResponse = await ContactRepository.get()
    if (contactResponse) { this.setState({ contact: contactResponse.contact }) }

    const foldersReponse = await FoldersRepository.get()
    if (foldersReponse) { this.setState({ folders: foldersReponse.folders }) }
  }

  render () {
    const { contact, folders } = this.state
    let folder
    if (contact && contact.folderId && folders.length > 0) {
      folder = (folders.filter(folder => folder.id === contact.folderId))[0]
    }

    return (
      <Layout>
        <br />
        <Row>
          <Col md={3}>
            <h2>Contacts <AddContactModal /></h2>
            <ContactsList />
          </Col>

          <Col md={9}>
            {
              folder && contact
                ? <Alert variant='warning'>
                  <h2>{contact.firstName} {contact.lastName}</h2>
                  <p>{folder.name}</p>
                  <EditContactModal /> <DestroyContactModal /> <AddTaskModal />
                </Alert>
                : null
            }
            <Row>
              <Col md={4}><TasksList /></Col>
              <Col md={8}><MessagesList /></Col>
            </Row>
          </Col>
        </Row>
        <TeamListener />
      </Layout>
    )
  }
}

export default Page
