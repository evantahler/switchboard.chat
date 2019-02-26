import React from 'react'
import { Alert, Form, Badge, ListGroup } from 'react-bootstrap'
import Moment from 'react-moment'
import SessionRepository from './../../repositories/session'
import ContactRepository from './../../repositories/contact'
import ContactsRepository from './../../repositories/contacts'
import FoldersRepository from './../../repositories/folders'

class ContactCard extends React.Component {
  async showMessages () {
    const contact = this.props.contact
    await ContactRepository.hydrate(contact)
  }

  render () {
    const contact = this.props.contact
    const bg = this.props.active ? 'info' : 'light'

    return (
      <ListGroup.Item variant={bg} onClick={this.showMessages.bind(this)}>
        {
          this.props.active
            ? <div id='selected-contact-card' />
            : null
        }

        {contact.firstName} {contact.lastName}
        &nbsp;
        {
          contact.unreadCount > 0 ? <Badge pill variant='danger'>{contact.unreadCount}</Badge> : null
        }
        &nbsp;
        {
          contact.tasksCount > 0 ? <Badge pill variant='warning'>{contact.tasksCount}</Badge> : null
        }

        <br />
        <span className='text-muted'>{contact.phoneNumber}</span>
        <br />
        {
          contact.mostRecentMessage
            ? <span className='text-muted'>Last Message <Moment fromNow ago>{contact.mostRecentMessage}</Moment> ago</span>
            : <span className='text-muted'>No messages</span>
        }
      </ListGroup.Item>
    )
  }
}

class ContactsList extends React.Component {
  constructor () {
    super()
    this.state = {
      contacts: [],
      folders: [],
      contact: {},
      folder: {}
    }
  }

  async componentDidMount () {
    ContactsRepository.subscribe('team-contacts-list', this.subscription.bind(this))
    ContactRepository.subscribe('team-contact-list', this.subscription.bind(this))
    return this.load()
  }

  componentWillUnmount () {
    ContactsRepository.unsubscribe('team-contacts-list')
    ContactRepository.unsubscribe('team-contacts-list')
  }

  async subscription () {
    await this.load()
  }

  async load () {
    const contactsResponse = await ContactsRepository.get()
    if (contactsResponse) { this.setState({ contacts: contactsResponse.contacts }) }
    const contactResponse = await ContactRepository.get()
    if (contactResponse) { this.setState({ contact: contactResponse.contact }) }
    const foldersResponse = await FoldersRepository.get()
    if (foldersResponse) { this.setState({ folders: foldersResponse.folders }) }

    // if (window) {
    //   let selectedContactCard = window.document.getElementById('selected-contact-card')
    //   if (selectedContactCard) {
    //     selectedContactCard.scrollIntoView()
    //   }
    // }
  }

  async updateSessionWithFolder (id) {
    let session = await SessionRepository.get()

    if (id === '__all') {
      delete session.folder
      await SessionRepository.set(session)
      this.setState({ folder: {} })
    } else {
      id = parseInt(id)
      const { folders } = this.state
      const folder = folders.filter(f => f.id === id)[0]

      session.folder = folder
      await SessionRepository.set(session)
      this.setState({ folder })
    }
  }

  render () {
    const { contact, contacts, folders, folder } = this.state

    const updateFolder = async (event) => {
      folder[event.target.id] = event.target.value
      await this.updateSessionWithFolder(event.target.value)
      const contactsResponse = await ContactsRepository.hydrate()
      if (contactsResponse) { this.setState({ contacts: contactsResponse.contacts }) }
    }

    const containerStyle = {
      maxHeight: 1000,
      overflow: 'auto'
    }

    return (
      <div>
        <Form.Group controlId='folderId'>
          <Form.Label>Folder</Form.Label>
          <Form.Control value={folder.id} required as='select' onChange={e => updateFolder(e)}>
            <option value='__all'>* All Contacts *</option>
            { folders.map(f => {
              return <option value={f.id} key={`folder-${f.id}`}>{f.name}</option>
            }) }
          </Form.Control>
        </Form.Group>

        <ListGroup style={containerStyle} id='contact-card-container'>
          { contacts.length > 0
            ? contacts.map((c) => {
              const active = contact ? (c.id === contact.id) : false
              return <ContactCard key={`contact-${c.id}`} active={active} contact={c} />
            })
            : <Alert variant='warning'>You have no contacts.  Why not create one?.</Alert>
          }
        </ListGroup>
      </div>
    )
  }
}

export default ContactsList
