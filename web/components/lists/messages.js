import React from 'react'
import { Card, Alert } from 'react-bootstrap'
import ContactRepository from './../../repositories/contact'
import MessagesRepository from './../../repositories/messages'
import EditContactModal from './../modals/contacts/edit.js'
import DestroyContactModal from './../modals/contacts/destroy.js'
import MessageAddForm from './../forms/message/add.js'

class MessageCard extends React.Component {
  render () {
    const message = this.props.message

    return (
      <Card>
        <Card.Body>
          <Card.Title>{message.createdAt}</Card.Title>
          <Card.Text>{message.message}</Card.Text>
        </Card.Body>
      </Card>
    )
  }
}

class MessagesList extends React.Component {
  constructor () {
    super()
    this.state = { contact: {}, messages: [] }
  }

  async componentDidMount () {
    ContactRepository.subscribe('message-list', this.subscription.bind(this))
    this.load()
  }

  componentWillUnmount () {
    ContactRepository.unsubscribe('message-list')
  }

  async subscription () {
    await this.load()
  }

  async load () {
    const contactResponse = await ContactRepository.get()
    if (contactResponse && contactResponse.contact) {
      this.setState({ contact: contactResponse.contact })
      await MessagesRepository.setKey()
      const messagesResponse = await MessagesRepository.get()
      if (messagesResponse) { this.setState({ messages: messagesResponse.messages }) }
    }
  }

  render () {
    const messages = this.state.messages
    const contact = this.state.contact

    if (!contact || !contact.id) {
      return <div>
        <br />
        <br />
        <Alert variant='warning'>Choose a Contact to view messages</Alert>
      </div>
    }

    return (
      <div>
        <h2>Messages with {contact.firstName} {contact.lastName} <EditContactModal /> <DestroyContactModal /></h2>
        <MessageAddForm />
        <br />
        { messages.length > 0
          ? messages.map((message) => { return <MessageCard key={`message-${message.id}`} message={message} /> })
          : <Alert variant='info'>No messages yet</Alert>
        }
      </div>
    )
  }
}

export default MessagesList
