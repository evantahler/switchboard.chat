import React from 'react'
import { Card, Table } from 'react-bootstrap'
import ContactsRepository from './../../repositories/contacts'
import ContactRepository from './../../repositories/contact'
import FoldersRepository from './../../repositories/folders'
import FolderEditModal from './../modals/folder/edit'
import FolderDestroyModal from './../modals/folder/destroy'

class ContactCard extends React.Component {
  async updateFolder (folder) {
    const contact = this.props.contact
    contact.folderId = folder.id
    contact.contactId = contact.id
    await ContactRepository.update(contact)
    await ContactsRepository.hydrate()
  }

  render () {
    const contact = this.props.contact
    const leftFolder = this.props.leftFolder
    const rightFolder = this.props.rightFolder

    return (
      <Card>
        <Card.Body>
          <Card.Text>
            <span>
              {
                leftFolder
                  ? <span onClick={this.updateFolder.bind(this, leftFolder)}>⏪</span>
                  : null
              }

              {contact.firstName} {contact.lastName}

              {
                rightFolder
                  ? <span onClick={this.updateFolder.bind(this, rightFolder)}>⏩</span>
                  : null
              }
            </span>
          </Card.Text>
        </Card.Body>
      </Card>
    )
  }
}

class ContactsColumn extends React.Component {
  render () {
    const contacts = this.props.contacts
    const leftFolder = this.props.leftFolder
    const rightFolder = this.props.rightFolder

    return <div>
      {
        contacts.map((contact) => {
          return <ContactCard
            key={`ContactCard-${contact.id}`}
            leftFolder={leftFolder}
            rightFolder={rightFolder}
            contact={contact}
          />
        })
      }
    </div>
  }
}

class HeaderCard extends React.Component {
  render () {
    const folder = this.props.folder

    return <th key={`header-${folder.id}`}>
      <strong>{folder.name}</strong>
      <br />
      <FolderEditModal folder={folder} />
      &nbsp;
      {
        folder.deletable
          ? <FolderDestroyModal folder={folder} />
          : null
      }
    </th>
  }
}

class FodlersList extends React.Component {
  constructor () {
    super()
    this.state = {
      contacts: [],
      folder: {},
      folders: []
    }
  }

  async componentDidMount () {
    FoldersRepository.subscribe('team-folders-list', this.subscription.bind(this))
    ContactsRepository.subscribe('team-folders-list', this.subscription.bind(this))
    return this.load()
  }

  componentWillUnmount () {
    FoldersRepository.unsubscribe('team-folders-list')
    ContactsRepository.unsubscribe('team-folders-list')
  }

  async subscription () {
    await this.load()
  }

  async load () {
    const contactsResponse = await ContactsRepository.get()
    if (contactsResponse) { this.setState({ contacts: contactsResponse.contacts }) }
    const foldersResponse = await FoldersRepository.get()
    if (foldersResponse) { this.setState({ folders: foldersResponse.folders }) }
  }

  render () {
    const folders = this.state.folders
    let contacts = {}

    if (folders.length > 0) {
      folders.forEach((folder) => {
        contacts[folder.id] = []
      })

      this.state.contacts.forEach((contact) => {
        contacts[contact.folderId].push(contact)
      })
    }

    return (
      <div style={{ overflow: 'auto' }}>
        <Table size='sm' bordered>
          <thead>
            <tr>
              {
                folders.map((folder) => {
                  return <HeaderCard key={`header-${folder.id}`} folder={folder} />
                })
              }
            </tr>
          </thead>
          <tbody>
            <tr>
              {
                folders.map((folder) => {
                  let idx = folders.indexOf(folder)
                  let leftFolder = idx > 0 ? folders[(idx - 1)] : null
                  let rightFolder = idx < folders.length ? folders[(idx + 1)] : null

                  return <td key={`contactsColumn-${folder.id}`}>
                    <ContactsColumn
                      folder={folder}
                      contacts={contacts[folder.id]}
                      leftFolder={leftFolder}
                      rightFolder={rightFolder}
                    />
                  </td>
                })
              }
            </tr>
          </tbody>
        </Table>
      </div>
    )
  }
}

export default FodlersList
