import React from 'react'
import { Card, Alert } from 'react-bootstrap'
import ContactsRepository from './../../repositories/contacts'
import FoldersRepository from './../../repositories/folders'

class ContactCard extends React.Component {
  render () {
    const contact = this.props.contact

    return (
      <Card>
        <Card.Body>
          <Card.Title>{contact.firstName} {contact.lastName}</Card.Title>
          <Card.Text>
            {contact.phoneNumber} <br />
            Most Recent Message @ {contact.mostRecentMessage || 'never'}
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
      hydrating: false
    }
  }

  async componentDidMount () {
    ContactsRepository.subscribe('team-contacts-list', this.subscription.bind(this))
    return this.load()
  }

  componentWillUnmount () {
    ContactsRepository.unsubscribe('team-contacts-list')
  }

  async subscription () {
    await this.load()
  }

  async load () {
    const contactResponse = await ContactsRepository.get()
    if (contactResponse) { this.setState({ contacts: contactResponse.contacts }) }
    const foldersResponse = await FoldersRepository.get()
    if (foldersResponse) { this.setState({ folders: foldersResponse.folders }) }
  }

  render () {
    const contacts = this.state.contacts

    return (
      <div>
        { contacts.length > 0
          ? contacts.map((contact) => { return <ContactCard key={`contact-${contact.id}`} contact={contact} /> })
          : <Alert variant='warning'>You have no contacts.  Why not create one?.</Alert>
        }
      </div>
    )
  }
}

export default ContactsList
