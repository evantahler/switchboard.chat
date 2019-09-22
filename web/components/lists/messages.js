import React from 'react'
import { ListGroup, Alert, Row, Col } from 'react-bootstrap'
import Moment from 'react-moment'
import ContactRepository from './../../repositories/contact'
import MessagesRepository from './../../repositories/messages'
import Loader from './../loader'
import Pagination from './../pagination'

class MessageCard extends React.Component {
  render () {
    const { message } = this.props

    const imageStyle = {
      maxWidth: 200,
      maxHeight: 200,
      minWidth: 100,
      minHeight: 100
    }

    let variant = 'none'
    if (message.type === 'note') { variant = 'warning' }
    if (message.direction === 'in') { variant = 'info' }

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

    return (
      <ListGroup.Item variant='warning'>
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
      loading: false,
      limit: 5,
      page: 0,
      messagesCount: 0,
      notesCount: 0
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
    const { limit, page } = this.state
    const offset = page * limit

    const contactResponse = await ContactRepository.get()
    if (contactResponse && contactResponse.contact) {
      this.setState({ contact: contactResponse.contact })
      await MessagesRepository.setKey()

      const messagesResponse = await MessagesRepository.get({ limit, offset })
      if (messagesResponse) {
        this.setState({
          messages: messagesResponse.messages,
          messagesCount: messagesResponse.messagesCount,
          notesCount: messagesResponse.notesCount
        })
      }
      this.setState({ loading: false })
    } else {
      this.setState({ loading: false })
    }
  }

  async changePage (page) {
    await this.setState({ page })
    this.load()
  }

  render () {
    const { messages, contact, loading, limit, page, messagesCount, notesCount } = this.state

    if (!contact || !contact.id) {
      return null
    }

    return (
      <div>
        {
          loading
            ? <Loader />
            : messages.length > 0
              ? <>
                <Pagination page={page} total={messagesCount} perPage={limit} onPress={(page) => this.changePage(page)} />
                <ListGroup>
                  {messages.map((message) => {
                    if (message.type === 'message') {
                      return <MessageCard key={`message-${message.id}`} message={message} />
                    } else if (message.type === 'note') {
                      return <NoteCard key={`note-${message.id}`} note={message} />
                    }
                  })}
                  <div ref={(el) => { this.messagesEnd = el }} />
                </ListGroup>
                <br />
                <Pagination page={page} total={messagesCount} perPage={limit} onPress={(page) => this.changePage(page)} />
                <br />
                <p className='text-muted'>{messagesCount} total messages, {notesCount} total notes</p>
              </>
              : <Alert variant='info'>No messages yet</Alert>
        }
      </div>
    )
  }
}

export default MessagesList
