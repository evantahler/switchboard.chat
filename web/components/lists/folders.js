import React from 'react'
import { ButtonGroup, Button } from 'react-bootstrap'
import FoldersRepository from './../../repositories/folders'
import FolderRepository from './../../repositories/folder'

class FolderButton extends React.Component {
  async toggleSelectedFolder () {
    const { active, folder } = this.props
    if (active) {
      await FolderRepository.remove()
    } else {
      await FolderRepository.hydrate(folder)
    }
  }

  render () {
    const { folder, active } = this.props
    const variant = active ? 'primary' : 'secondary'

    return (
      <Button variant={variant} onClick={this.toggleSelectedFolder.bind(this)}>
        {folder.name}
      </Button>
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

    if (folders.length === 1) { return null }
    const allButtonVariant = folder.id ? 'secondary' : 'primary'

    return (
      <div>
        <ButtonGroup id='folder-card-container'>
          <Button variant={allButtonVariant} onClick={(() => FolderRepository.remove())}>All</Button>
          {
            folders.map((f) => {
              const active = folder ? (f.id === folder.id) : false
              return <FolderButton key={`folder-${f.id}`} active={active} folder={f} />
            })
          }
        </ButtonGroup>
      </div>
    )
  }
}

export default FoldersList
