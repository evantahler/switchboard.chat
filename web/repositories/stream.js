import BaseRepository from './base'
import SuccessRepository from './success'
import ErrorRepository from './error'
import SessionRepository from './session'
import FolderRepository from './folder'

class MessagesRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'stream'
    this.ttl = 1000 // 1 second (so we allways check for new messages)
    this.key = 'repository:stream'
    this.responseKeys = ['messages']
    this.routes.get.path = '/api/messages'
    this.routes.create.path = '/api/message'
  }

  async setKey () {
    const folderResponse = await FolderRepository.get()
    if (folderResponse && folderResponse.folder) {
      this.key = `repository:stream:${folderResponse.folder.id}`
    } else {
      this.key = `repository:stream`
    }
  }
}

const repository = new MessagesRepository()
repository.successHandler = SuccessRepository
repository.errorHandler = ErrorRepository
repository.includeParamsInRequests = async () => {
  const session = await SessionRepository.get()
  const folderResponse = await FolderRepository.get()
  return {
    csrfToken: session ? session.csrfToken : '',
    teamId: session && session.team ? session.team.id : null,
    folderId: folderResponse && folderResponse.folder ? folderResponse.folder.id : null
  }
}

export default repository
