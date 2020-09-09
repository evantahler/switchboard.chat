import React from 'react'
import { Card, CardItem, Body, Picker } from 'native-base'
import FoldersRepository from './../../../web/repositories/folders'
import FolderRepository from './../../../web/repositories/folder'

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

  async saveFolderSelection (folderId) {
    const { folders } = this.state
    let folder
    folders.map((f) => {
      if (f.id === folderId) { folder = f }
    })

    if (folder) {
      await FolderRepository.hydrate(folder)
    } else {
      await FolderRepository.remove()
    }
  }

  render () {
    const { folders, folder } = this.state

    return (
      <Card>
        <CardItem>
          <Body>
            <Picker
              note
              mode='dropdown'
              textStyle={{
                fontSize: 16,
                color: '#000',
                textDecorationLine: 'underline'
              }}
              selectedValue={folder.id ? folder.id : '__allFolders'}
              onValueChange={this.saveFolderSelection.bind(this)}
            >
              <Picker.Item key='__allFolders' label='All Folders' value='__allFolders' />
              {
                folders.map((f) => {
                  return <Picker.Item key={f.id} label={f.name} value={f.id} />
                })
              }
            </Picker>
          </Body>
        </CardItem>
      </Card>
    )
  }
}

export default FoldersList
