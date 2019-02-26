import React from 'react'
import { ListGroup } from 'react-bootstrap'
import FoldersRepository from './../../repositories/folders'
import FolderRepository from './../../repositories/folder'

class FolderCard extends React.Component {
  async toggleSelectedFolder () {
    const folder = this.props.folder
    if (this.props.active) {
      await FolderRepository.remove()
    } else {
      await FolderRepository.hydrate(folder)
    }
  }

  render () {
    const folder = this.props.folder
    const bg = this.props.active ? 'info' : 'light'

    return (
      <ListGroup.Item variant={bg} onClick={this.toggleSelectedFolder.bind(this)}>
        { folder.name }
      </ListGroup.Item>
    )
  }
}

class FoldersList extends React.Component {
  constructor () {
    super()
    this.state = {
      folders: [],
      folder: {}
    }
  }

  async componentDidMount () {
    FoldersRepository.subscribe('team-folders-list', this.subscription.bind(this))
    FolderRepository.subscribe('team-folders-list', this.subscription.bind(this))
    return this.load()
  }

  componentWillUnmount () {
    FoldersRepository.unsubscribe('team-folders-list')
    FolderRepository.unsubscribe('team-folders-list')
  }

  async subscription () {
    await this.load()
  }

  async load () {
    const foldersResponse = await FoldersRepository.get()
    if (foldersResponse) { this.setState({ folders: foldersResponse.folders }) }

    const folderResponse = await FolderRepository.get()
    if (folderResponse) { this.setState({ folder: folderResponse.folder ? folderResponse.folder : {} }) }
  }

  render () {
    const { folders, folder } = this.state

    return (
      <div>
        <ListGroup id='folder-card-container'>
          {
            folders.map((f) => {
              const active = folder ? (f.id === folder.id) : false
              return <FolderCard key={`folder-${f.id}`} active={active} folder={f} />
            })
          }
        </ListGroup>
      </div>
    )
  }
}

export default FoldersList
