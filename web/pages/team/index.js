import React from 'react'
import { Row, Col, Jumbotron } from 'react-bootstrap'
import Layout from './../../components/layouts/loggedIn.js'
import TeamListener from './../../components/teamListener.js'
import TeamRepository from './../../repositories/team.js'
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
    const teamResponse = await TeamRepository.get()
    if (teamResponse) { this.setState({ team: teamResponse.team }) }

    const contactResponse = await ContactRepository.get()
    if (contactResponse) { this.setState({ contact: contactResponse.contact }) }

    const foldersReponse = await FoldersRepository.get()
    if (foldersReponse) { this.setState({ folders: foldersReponse.folders }) }
  }

  render () {
    const { team, contact, folders } = this.state
    let folder
    if (contact && contact.folderId && folders.length > 0) {
      folder = (folders.filter(folder => folder.id === contact.folderId))[0]
    }

    return (
      <Layout>
        <h1>{team.name}</h1>
        <TeamListener />
        <br />
        <Row>
          <Col md={4}>
            <h2>Contacts <AddContactModal /></h2>
            <ContactsList />
          </Col>

          <Col md={8}>
            {
              folder && contact
                ? <Jumbotron>
                  <p>{folder.name}</p>
                  <h2>{contact.firstName} {contact.lastName}</h2>
                  <br />
                  <br />
                  <EditContactModal /> <DestroyContactModal /> <AddTaskModal />
                </Jumbotron>
                : null
            }

            <TasksList />
            <MessagesList />
          </Col>
        </Row>
      </Layout>
    )
  }
}

export default Page
