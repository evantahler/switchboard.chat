import React from 'react'
import { Row, Col, Tabs, Tab } from 'react-bootstrap'
import Moment from 'react-moment'
import Layout from './../../components/layouts/loggedIn.js'
import TeamListener from './../../components/teamListener.js'
import ContactsList from './../../components/lists/contacts.js'
import ContactRepository from './../../repositories/contact.js'
import ContactsRepository from './../../repositories/contacts.js'
import FolderRepository from './../../repositories/folder.js'
import MessagesList from './../../components/lists/messages.js'
import TasksList from './../../components/lists/tasks.js'
import AddContactModal from './../../components/modals/contact/add.js'
import EditContactModal from './../../components/modals/contact/edit.js'
import AddTaskModal from './../../components/modals/task/add.js'
import DestroyContactModal from './../../components/modals/contact/destroy.js'
import FoldersList from './../../components/lists/folders'
import MessageAddForm from './../../components/forms/message/add.js'
import NoteAddForm from './../../components/forms/note/add.js'

class Page extends React.Component {
  constructor () {
    super()
    this.state = {
      team: {},
      contact: {},
      folder: {},
      contacts: []
    }
  }

  async componentDidMount () {
    ContactRepository.subscribe('team-index', this.subscription.bind(this))
    ContactsRepository.subscribe('team-index', this.subscription.bind(this))
    FolderRepository.subscribe('team-index', this.subscription.bind(this))
    await this.load()
  }

  componentWillUnmount () {
    ContactRepository.unsubscribe('team-index')
    ContactsRepository.unsubscribe('team-index')
    FolderRepository.unsubscribe('team-index')
  }

  async subscription () {
    await this.load()
  }

  async load () {
    const contactsResponse = await ContactsRepository.get()
    if (contactsResponse) { this.setState({ contacts: contactsResponse.contacts }) }

    const contactResponse = await ContactRepository.get()
    if (contactResponse) { this.setState({ contact: contactResponse.contact }) }

    const folderReponse = await FolderRepository.get()
    if (folderReponse) { this.setState({ folder: folderReponse.folder }) }
  }

  render () {
    const { contact, folder, contacts } = this.state

    return (
      <Layout>
        <Row>
          <Col>
            <h2>Contacts</h2>
            <Row>
              <Col md={9}><FoldersList /></Col>
              <Col style={{ textAlign: 'right' }} md={3}><AddContactModal /></Col>
            </Row>
          </Col>
        </Row>

        <br />

        <Row>
          <Col md={4}>
            <ContactsList />
          </Col>

          <Col md={8}>
            {
              contact && (!folder || contact.folderId === folder.id)
                ? <div>
                    <Row>
                        <Col>
                          <h2>{contact.firstName} {contact.lastName} <span className='text-muted'> / {contact.phoneNumber}</span></h2>

                          <Tabs defaultActiveKey="messages">
                            <Tab eventKey="info" title="Info">
                              <br />
                              <h3>Contact Information</h3>
                              <p>
                                {/* <p>{contact.folderId}</p> */}
                                Most Recent Message: {
                                  contact.mostRecentMessage ? <span><Moment fromNow ago>{contact.mostRecentMessage}</Moment> ago </span> : 'never'
                                }<br />
                                Unread Messages: {contact.unreadCount}<br />
                                Tasks: {contact.tasksCount}
                              </p>
                              <EditContactModal /> <DestroyContactModal />
                            </Tab>
                            <Tab eventKey="messages" title="Messages">
                              <br />
                              <h3>Messages & Notes</h3>
                              <MessagesList />
                            </Tab>
                            <Tab eventKey="send-message" title="Send Message">
                              <br />
                              <h3>Send Message</h3>
                              <MessageAddForm />
                            </Tab>
                            <Tab eventKey="add-note" title="Add Note">
                              <br />
                              <h3>Add Note</h3>
                              <NoteAddForm />
                            </Tab>
                            <Tab eventKey="tasks" title="Tasks">
                              <br />
                              <h3>Tasks</h3>
                              <AddTaskModal />
                              <br />
                              <br />
                              <TasksList />
                            </Tab>
                          </Tabs>
                        </Col>
                    </Row>
                  </div>
                : null
            }
          </Col>
        </Row>

        <br />
        <TeamListener />
      </Layout>
    )
  }
}

export default Page
