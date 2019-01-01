import BaseRepository from './base'
import SuccessRepository from './success'
import ErrorRepository from './error'
import SessionRepository from './session'

class FoldersRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'folders'
    this.key = 'repository:folders'
    this.responseKeys = ['folders']
    this.routes.get.path = '/api/folders'
    this.routes.create.path = '/api/folder'
    this.routes.update.path = '/api/folder'
    this.routes.destroy.path = '/api/folder'
  }
}

const repository = new FoldersRepository()
repository.successHandler = SuccessRepository
repository.errorHandler = ErrorRepository
repository.includeParamsInRequests = async () => {
  const session = await SessionRepository.get()
  return {
    csrfToken: session ? session.csrfToken : '',
    teamId: session && session.team ? session.team.id : null
  }
}

export default repository
