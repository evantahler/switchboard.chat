import React from 'react'
import { ListGroup, Alert } from 'react-bootstrap'
import Moment from 'react-moment'
import ContactRepository from './../../repositories/contact'
import MessagesRepository from './../../repositories/messages'
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
    await this.load()
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

  render () {
    const { messages, contact } = this.state

    if (!contact || !contact.id) {
      return null
    }

    const containerStyle = {
      maxHeight: 1000,
      overflow: 'auto'
    }

    return (
      <div>
        <h3>Messages</h3>
        <MessageAddForm />
        <br />
        { messages.length > 0
          ? <ListGroup style={containerStyle}>
            { messages.reverse().map((message) => {
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
      </div>
    )
  }
}

export default MessagesList
