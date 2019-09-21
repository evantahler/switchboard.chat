import React from 'react'
import { ListGroup, Alert, Row, Col } from 'react-bootstrap'
import Moment from 'react-moment'
import ContactRepository from './../../repositories/contact'
import MessagesRepository from './../../repositories/messages'
import Loader from './../loader'

class MessageCard extends React.Component {
  render () {
    const { message } = this.props

    const imageStyle = {
      maxWidth: 200,
      maxHeight: 200,
      minWidth: 100,
      minHeight: 100
    }

    let variant = 'none'; let prefix = 'to'
    if (message.type === 'note') { variant = 'warning'; prefix = 'about' }
    if (message.direction === 'in') { variant = 'info'; prefix = 'from' }

    return (
      <ListGroup.Item variant={variant}>
        <Row>
          <Col md={8}>
            {
              message.type === 'message'
                ? message.message
                : <span>{message.message}<br /><span className='text-muted'> - {message.user.firstName} {message.user.lastName}</span></span>
            }
            {
              message.attachment
                ? <><br /><br /><img style={imageStyle} src={message.attachment} /></>
                : null
            }
          </Col>
          <Col md={4}>
            <p className='text-muted' style={{ textAlign: 'right' }}>
              <Moment fromNow ago>{message.createdAt}</Moment> ago
            </p>
          </Col>
        </Row>
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
      <ListGroup.Item style={style} variant='warning'>
        <p>{note.message}</p>
        <p className='text-muted'>{note.user.firstName} {note.user.lastName}, <Moment fromNow ago>{note.createdAt}</Moment> ago</p>
      </ListGroup.Item>
    )
  }
}

class MessagesList extends React.Component {
  constructor () {
    super()
    this.state = {
      contact: {},
      messages: [],
      loading: false
    }
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
    this.setState({ loading: true })
    const contactResponse = await ContactRepository.get()
    if (contactResponse && contactResponse.contact) {
      this.setState({ contact: contactResponse.contact })
      await MessagesRepository.setKey()
      const messagesResponse = await MessagesRepository.get()
      if (messagesResponse) { this.setState({ messages: messagesResponse.messages }) }
      this.setState({ loading: false })
    } else {
      this.setState({ loading: false })
    }
  }

  render () {
    const { messages, contact, loading } = this.state

    if (!contact || !contact.id) {
      return null
    }

    return (
      <div>
        {messages.length > 0
          ? loading
            ? <Loader />
            : <ListGroup>
              {messages.map((message) => {
                if (message.type === 'message') {
                  return <MessageCard key={`message-${message.id}`} message={message} />
                } else if (message.type === 'note') {
                  return <NoteCard key={`note-${message.id}`} note={message} />
                }
              })}
              <div ref={(el) => { this.messagesEnd = el }} />
            </ListGroup>
          : <Alert variant='info'>No messages yet</Alert>}
      </div>
    )
  }
}

export default MessagesList
