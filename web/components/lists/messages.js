import React from 'react'
import { ListGroup, Alert } from 'react-bootstrap'
import Moment from 'react-moment'
import ContactRepository from './../../repositories/contact'
import MessagesRepository from './../../repositories/messages'
import EditContactModal from './../modals/contact/edit.js'
import DestroyContactModal from './../modals/contact/destroy.js'
import MessageAddForm from './../forms/message/add.js'

class MessageCard extends React.Component {
  render () {
    const message = this.props.message
    let variant = 'success'
    if (message.direction === 'out') { variant = 'info' }

    const imageStyle = {
      maxWidth: 400,
      maxHeight: 400,
      minWidth: 200,
      minHeight: 200
    }

    return (
      <ListGroup.Item variant={variant}>
        <p>{message.message}</p>
        {
          message.attachment
            ? <img style={imageStyle} src={message.attachment} />
            : null
        }
        <p className='text-muted'><Moment fromNow ago>{message.createdAt}</Moment> ago</p>
      </ListGroup.Item>
    )
  }
}

class NoteCard extends React.Component {
  render () {
    const note = this.props.note

    const style = {
      borderLeftColor: '#00000070',
      borderLeftWidth: 10
    }

    return (
      <ListGroup.Item style={style} variant='secondary'>
        <p>{note.message}</p>
        <p className='text-muted'>{note.user.firstName} {note.user.lastName}, <Moment fromNow ago>{note.createdAt}</Moment> ago</p>
      </ListGroup.Item>
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
    MessagesRepository.subscribe('message-list', this.subscription.bind(this))
    this.load()
    this.scrollToBottom()
  }

  componentWillUnmount () {
    ContactRepository.unsubscribe('message-list')
    MessagesRepository.unsubscribe('message-list')
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

  scrollToBottom () {
    if (!this.messagesEnd) { return }
    this.messagesEnd.scrollIntoView({ behavior: 'smooth' })
  }

  componentDidUpdate () {
    this.scrollToBottom()
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

    const containerStyle = {
      maxHeight: 500,
      overflow: 'auto'
    }

    return (
      <div>
        <h2>📞 with {contact.firstName} {contact.lastName} <EditContactModal /> <DestroyContactModal /></h2>
        { messages.length > 0
          ? <ListGroup style={containerStyle}>
            { messages.map((message) => {
              if (message.type === 'message') {
                return <MessageCard key={`message-${message.id}`} message={message} />
              } else if (message.type === 'note') {
                return <NoteCard key={`note-${message.id}`} note={message} />
              }
            })
            }
            <div ref={(el) => { this.messagesEnd = el }} />
          </ListGroup>
          : <Alert variant='info'>No messages yet</Alert>
        }
        <br />
        <MessageAddForm />
      </div>
    )
  }
}

export default MessagesList
