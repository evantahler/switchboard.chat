import React from 'react'
import { View } from 'react-native'
import { Text, Thumbnail, Body, List, ListItem, Right, Left, Icon } from 'native-base'
import FolderRepository from './../../../web/repositories/folder'
import StreamRepository from './../../../web/repositories/stream'
import ContactsRepository from './../../../web/repositories/contacts'
import ContactRepository from './../../../web/repositories/contact'
import Loader from './../loader'

const formatDate = (s) => {
  const date = new Date(s)
  const y = date.getFullYear()
  const m = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1)
  const d = (date.getDate() < 10 ? '0' : '') + date.getDate()
  return `${y}-${m}-${d}`
}

const formatTime = (s) => {
  const date = new Date(s)
  const h = (date.getHours() < 10 ? '0' : '') + date.getHours()
  const m = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
  return `${h}:${m}`
}

class MessageRow extends React.Component {
  constructor () {
    super()
    this.state = {
      contact: null
    }
  }

  async componentDidMount () {
    const { message, contactsHashById } = this.props
    let contact

    if (contactsHashById[message.contactId]) {
      contact = contactsHashById[message.contactId]
    }

    this.setState({ contact })
  }

  async showContact () {
    const { contact } = this.state
    await ContactRepository.hydrate(contact)
    // Router.push('/team/contacts')
  }

  render () {
    const { message } = this.props
    const { contact } = this.state

    let backgroundColor = 'white'
    if (message.type === 'note') { backgroundColor = '#D3D3D3' }
    let icon
    let iconColor
    if (message.direction === 'in') { icon = 'return-left'; iconColor = 'green' }
    if (message.direction === 'out') { icon = 'return-right'; iconColor = 'blue' }

    const style = {
      backgroundColor: backgroundColor
    }

    return (
      <ListItem style={style} avatar onPress={this.showContact.bind(this)}>
        {
          icon
            ? <Left><Icon name={icon} style={{ color: iconColor }} /></Left>
            : null
        }
        <Body>
          <Text note>{contact ? `${contact.firstName} ${contact.lastName}` : message.contactId}</Text>
          {
            message.type === 'message'
              ? <Text>{message.message}</Text>
              : <>
                <Text>{message.message}</Text>
                <Text note> - {message.user.firstName} {message.user.lastName}</Text>
              </>
          }
          {
            message.attachment
              ? <Thumbnail square large source={{ uri: message.attachment }} />
              : null
          }
        </Body>
        <Right>
          <Text note>{formatDate(message.createdAt)}</Text>
          <Text note>{formatTime(message.createdAt)}</Text>
        </Right>
      </ListItem>
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
    if (this.state.loading === true) { return }

    this.setState({ loading: true })
    const folderResponse = await FolderRepository.get()
    if (folderResponse) { this.setState({ folder: folderResponse.folder ? folderResponse.folder : {} }) }

    const contactsResponse = await ContactsRepository.get()
    if (contactsResponse) {
      let contactsHashById = {}
      contactsResponse.contacts.map((contact) => { contactsHashById[contact.id] = contact })
      this.setState({ contactsHashById: contactsHashById })
    }

    await StreamRepository.setKey()
    const streamResponse = await StreamRepository.get()
    if (streamResponse) { this.setState({ messages: streamResponse.messages }) }
    this.setState({ loading: false })
  }

  render () {
    const { messages, loading, contactsHashById } = this.state

    const style = {
      backgroundColor: '#ffffff'
    }

    return (
      <View style={style}>
        {
          loading
            ? <Loader />
            : <List>
              {
                messages.map(message => <MessageRow key={`message-${message.type}-${message.id}`} message={message} contactsHashById={contactsHashById} />)
              }
            </List>
        }
      </View>
    )
  }
}

export default StreamList
