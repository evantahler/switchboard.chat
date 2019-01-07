import React from 'react'
import { Card, Alert, Form } from 'react-bootstrap'
import Moment from 'react-moment'
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
    const bg = this.props.active ? 'primary' : 'light'

    return (
      <Card bg={bg} onClick={this.showMessages.bind(this)}>
        <Card.Body>
          <Card.Title>{contact.firstName} {contact.lastName}</Card.Title>
          <Card.Text>
            <span>{contact.phoneNumber}</span>
            <br />
            {
              contact.mostRecentMessage
                ? <span className='text-muted'>Last Message <Moment fromNow ago>{contact.mostRecentMessage}</Moment> ago</span>
                : <span className='text-muted'>No message</span>
            }
          </Card.Text>
        </Card.Body>
      </Card>
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
    const folder = this.state.folder

    const contactsResponse = await ContactsRepository.get({ folderId: folder.id })
    if (contactsResponse) { this.setState({ contacts: contactsResponse.contacts }) }
    const contactResponse = await ContactRepository.get()
    if (contactResponse) { this.setState({ contact: contactResponse.contact }) }
    const foldersResponse = await FoldersRepository.get()
    if (foldersResponse) { this.setState({ folders: foldersResponse.folders }) }
  }

  render () {
    const { contact, contacts, folders, folder } = this.state

    const updateFolder = async (event) => {
      if (event.target.value === '__all') { event.target.value = null }
      folder[event.target.id] = event.target.value
      const contactsResponse = await ContactsRepository.hydrate({ folderId: event.target.value })
      if (contactsResponse) { this.setState({ folder, contacts: contactsResponse.contacts }) }
    }

    return (
      <div>
        <Form.Group controlId='folderId'>
          <Form.Label>Folder</Form.Label>
          <Form.Control value={folder.id} required as='select' onChange={e => updateFolder(e)}>
            <option value={null}>* All Contacts *</option>
            { folders.map(f => {
              return <option value={f.id} key={`folder-${f.id}`}>{f.name}</option>
            }) }
          </Form.Control>
        </Form.Group>

        { contacts.length > 0
          ? contacts.map((c) => {
            const active = contact ? (c.id === contact.id) : false
            return <ContactCard key={`contact-${c.id}`} active={active} contact={c} />
          })
          : <Alert variant='warning'>You have no contacts.  Why not create one?.</Alert>
        }
      </div>
    )
  }
}

export default ContactsList
