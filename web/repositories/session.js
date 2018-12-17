import BaseRepository from './base'
import ErrorRepository from './error'

class SessionRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'session'
    this.key = 'repository:session'
    this.responseKeys = ['csrfToken', 'userId']
    this.routes.create.path = '/api/session'
    this.routes.destroy.path = '/api/session'
  }
}

const repository = new SessionRepository()
repository.errorHandler = ErrorRepository
export default repository
