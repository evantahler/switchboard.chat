import React from 'react'
import Moment from 'react-moment'
import Router from 'next/router'
import { Row, Col, ListGroup } from 'react-bootstrap'
import FolderRepository from './../../repositories/folder'
import StreamRepository from './../../repositories/stream'
import ContactsRepository from './../../repositories/contacts'
import ContactRepository from './../../repositories/contact'
import FoldersList from './folders.js'
import Loader from './../loader'
import Pagination from './../pagination'

class MessageRow extends React.Component {
  async showContact () {
    const { contact } = this.props
    await ContactRepository.hydrate(contact)
    Router.push('/team/contacts')
  }

  render () {
    const { message, contact } = this.props

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
      <ListGroup.Item variant={variant} onClick={this.showContact.bind(this)}>
        <Row>
          <Col>
            <span className={`text-${variant}`}> {prefix} </span>
            <strong>{contact ? `${contact.firstName} ${contact.lastName}` : message.contactId}</strong>
            { contact ? <span className='text-muted'> / {contact.phoneNumber}</span> : null }
          </Col>
          <Col>
            <p className='text-muted' style={{ textAlign: 'right' }}>
              <Moment fromNow ago>{message.createdAt}</Moment> ago
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
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
        </Row>
      </ListGroup.Item>
    )
  }
}

class StreamList extends React.Component {
  constructor () {
    super()
    this.state = {
      folder: {},
      contactsHashById: {},
      messages: [],
      loading: false,
      limit: 100,
      page: 0,
      messagesCount: 0,
      notesCount: 0
    }
  }

  async componentDidMount () {
    FolderRepository.subscribe('team-stream-list', this.subscription.bind(this))
    StreamRepository.subscribe('team-stream-list', this.subscription.bind(this))
    return this.load()
  }

  componentWillUnmount () {
    FolderRepository.unsubscribe('team-stream-list')
    StreamRepository.unsubscribe('team-stream-list')
  }

  async subscription () {
    await this.load()
  }

  async load () {
    this.setState({ loading: true })
    const folderResponse = await FolderRepository.get()
    if (folderResponse) { this.setState({ folder: folderResponse.folder ? folderResponse.folder : {} }) }

    const contactsResponse = await ContactsRepository.get()
    if (contactsResponse) {
      const contactsHashById = {}
      contactsResponse.contacts.map((contact) => { contactsHashById[contact.id] = contact })
      this.setState({ contactsHashById: contactsHashById })
    }

    await StreamRepository.setKey()
    const { limit, page } = this.state
    const offset = page * limit
    const streamResponse = await StreamRepository.get({ limit, offset })
    if (streamResponse) {
      this.setState({
        messages: streamResponse.messages,
        messagesCount: streamResponse.messagesCount,
        notesCount: streamResponse.notesCount
      })
    }
    this.setState({ loading: false })
  }

  async changePage (page) {
    await this.setState({ page })
    this.load()
  }

  render () {
    const { folder, messages, messagesCount, notesCount, limit, page, loading, contactsHashById } = this.state

    if (!loading && messages.length === 0) {
      return (
        <>
          <h2>{folder.name ? `${folder.name} Messages` : 'All Messages'}</h2>
          <FoldersList />
          <br />
          <p className='text-muted'>No messages yet...</p>
        </>
      )
    }

    return (
      <>
        <h2>{folder.name ? `${folder.name} Messages` : 'All Messages'}</h2>
        <FoldersList />
        <br />
        {
          loading
            ? <Loader />
            : <>
              <p className='text-muted'>Click a contact to see thread and send messages</p>
              <Pagination page={page} total={messagesCount} perPage={limit} onPress={(page) => this.changePage(page)} />
              <ListGroup>
                {
                  messages.map(message => <MessageRow key={`message-${message.type}-${message.id}`} message={message} contact={contactsHashById[message.contactId]} />)
                }
              </ListGroup>
              <br />
              <Pagination page={page} total={messagesCount} perPage={limit} onPress={(page) => this.changePage(page)} />
              <p className='text-muted'>{messagesCount} total messages, {notesCount} total notes</p>
            </>
        }
      </>
    )
  }
}

export default StreamList
