import React from 'react'
import { Card, Table } from 'react-bootstrap'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import ContactsRepository from './../../repositories/contacts'
import ContactRepository from './../../repositories/contact'
import FoldersRepository from './../../repositories/folders'
import SessionRepository from './../../repositories/session'
import FolderEditModal from './../modals/folder/edit'
import FolderDestroyModal from './../modals/folder/destroy'

class ContactCard extends React.Component {
  render () {
    const contact = this.props.contact
    const index = this.props.idx

    const style = {
      maxWidth: 300,
      margin: 2
    }

    return (
      <Draggable draggableId={`contact-${contact.id}`} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Card style={style}>
              <Card.Body>
                <Card.Text>
                  <span>
                    {contact.firstName} {contact.lastName}
                  </span>
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        )}
      </Draggable>
    )
  }
}

class ContactsColumn extends React.Component {
  render () {
    const contacts = this.props.contacts
    const folder = this.props.folder

    let idx = -1

    return <Droppable droppableId={`folder-${folder.id}`}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          style={{
            backgroundColor: snapshot.isDraggingOver ? 'lightGrey' : null,
            minHeight: 300
          }}
          {...provided.droppableProps}
        >
          {
            contacts.map((contact) => {
              idx++
              return <ContactCard
                key={`ContactCard-${contact.id}`}
                contact={contact}
                idx={idx}
              />
            })
          }
          { provided.placeholder }
        </div>
      )}
    </Droppable>
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
    const session = await SessionRepository.get()
    if (session) {
      delete session.folder
      await SessionRepository.set(session)
    }

    const contactsResponse = await ContactsRepository.get()
    if (contactsResponse) { this.setState({ contacts: contactsResponse.contacts }) }
    const foldersResponse = await FoldersRepository.get()
    if (foldersResponse) { this.setState({ folders: foldersResponse.folders }) }
  }

  async onDragEnd (args) {
    let { contacts } = this.state

    if (!args.draggableId) { return }
    if (!args.destination) { return }

    const contactId = parseInt(args.draggableId.split('contact-')[1])
    const folderId = parseInt(args.destination.droppableId.split('folder-')[1])
    const contact = contacts.filter(c => c.id === contactId)[0]
    contact.folderId = folderId
    contact.contactId = contact.id

    for (let i in contacts) {
      if (contacts[i].id === contact.id) {
        contacts[i] = contact
        break
      }
    }
    this.setState({ contacts })

    await ContactRepository.update(contact)
    await ContactsRepository.hydrate()
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
      <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
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
                    return <td key={`contactsColumn-${folder.id}`}>
                      <ContactsColumn
                        folder={folder}
                        contacts={contacts[folder.id]}
                      />
                    </td>
                  })
                }
              </tr>
            </tbody>
          </Table>
        </div>
      </DragDropContext>
    )
  }
}

export default FodlersList
