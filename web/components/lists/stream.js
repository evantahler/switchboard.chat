import React from 'react'
import { Table } from 'react-bootstrap'
import Moment from 'react-moment'
import Router from 'next/router'
import FolderRepository from './../../repositories/folder'
import StreamRepository from './../../repositories/stream'
import ContactsRepository from './../../repositories/contacts'
import ContactRepository from './../../repositories/contact'
import Loader from './../loader'

class MessageRow extends React.Component {
  constructor () {
    super()
    this.state = {
      contacts: [],
      contact: {}
    }
  }

  async componentDidMount () {
    const { message } = this.props
    const contactsResponse = await ContactsRepository.get()

    if (contactsResponse) {
      let contacts = contactsResponse.contacts
      this.setState({ contacts })

      let contact
      for (let i in contacts) {
        if (contacts[i].id === message.contactId) {
          contact = contacts[i]
          break
        }
      }

      this.setState({ contact })
    }
  }

  async showContact () {
    const { contact } = this.state
    await ContactRepository.hydrate(contact)
    Router.push('/team/contacts')
  }

  render () {
    const { message } = this.props
    const { contact } = this.state

    const imageStyle = {
      maxWidth: 400,
      maxHeight: 400,
      minWidth: 200,
      minHeight: 200
    }

    let variant = 'success'
    if (message.type === 'note') { variant = 'secondary' }
    if (message.direction === 'out') { variant = 'info' }

    return (
      <tr className={`table-${variant}`} onClick={this.showContact.bind(this)}>
        <td>
          {contact ? `${contact.firstName} ${contact.lastName}` : message.contactId}
          {
            contact ? <><br /><span className='text-muted'>{ contact.phoneNumber }</span></> : null
          }
        </td>
        <td>
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
        </td>
        <td>{message.direction}</td>
        <td><Moment fromNow ago>{message.createdAt}</Moment> ago</td>
      </tr>
    )
  }
}

class StreamList extends React.Component {
  constructor () {
    super()
    this.state = {
      folder: {},
      contacts: [],
      messages: [],
      loading: false
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
    if (contactsResponse) { this.setState({ contacts: contactsResponse.contacts }) }

    await StreamRepository.setKey()
    const streamResponse = await StreamRepository.get()
    if (streamResponse) { this.setState({ messages: streamResponse.messages.reverse() }) }
    this.setState({ loading: false })
  }

  render () {
    const { folder, messages, loading } = this.state

    return (
      <>
        <h2>{ folder.name ? `${folder.name} Messages` : 'All Messages' }</h2>
        <p className='text-muted'>Click a contect to see thread and send messages</p>
        {
          loading
            ? <Loader />
            : <Table striped bordered hover size='sm'>
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Message</th>
                  <th>Direction</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {
                  messages.map(message => <MessageRow key={`message-${message.type}-${message.id}`} message={message} />)
                }
              </tbody>
            </Table>
        }

      </>
    )
  }
}

export default StreamList
