import React from 'react'
import { Badge, ListGroup } from 'react-bootstrap'
import ContactRepository from './../../repositories/contact'
import ContactsRepository from './../../repositories/contacts'
import FolderRepository from './../../repositories/folder'

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
      </ListGroup.Item>
    )
  }
}

class ContactsList extends React.Component {
  constructor () {
    super()
    this.state = {
      contacts: [],
      contact: {},
      folder: {}
    }
  }

  async componentDidMount () {
    ContactsRepository.subscribe('team-contacts-list', this.subscription.bind(this))
    ContactRepository.subscribe('team-contact-list', this.subscription.bind(this))
    FolderRepository.subscribe('team-contact-list', this.subscription.bind(this))
    return this.load()
  }

  componentWillUnmount () {
    ContactsRepository.unsubscribe('team-contacts-list')
    ContactRepository.unsubscribe('team-contacts-list')
    FolderRepository.unsubscribe('team-contacts-list')
  }

  async subscription () {
    await this.load()
  }

  async load () {
    const contactsResponse = await ContactsRepository.get()
    if (contactsResponse) { this.setState({ contacts: contactsResponse.contacts }) }

    const contactResponse = await ContactRepository.get()
    if (contactResponse) { this.setState({ contact: contactResponse.contact }) }

    const folderResponse = await FolderRepository.get()
    if (folderResponse) { this.setState({ folder: folderResponse.folder }) }
  }

  render () {
    const { contact, contacts, folder } = this.state

    let filteredContacts = contacts
    if (folder && folder.id) {
      filteredContacts = contacts.filter(c => c.folderId === folder.id)
    }

    return (
      <div>
        <ListGroup>
          {filteredContacts.length > 0
            ? filteredContacts.map((c) => {
              const active = contact ? (c.id === contact.id) : false
              return <ContactCard key={`contact-${c.id}`} active={active} contact={c} />
            })
            : <p className='text-warning'>You have no contacts in this folder.<br />Why not create one?</p>}
        </ListGroup>
      </div>
    )
  }
}

export default ContactsList
