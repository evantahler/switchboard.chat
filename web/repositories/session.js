import BaseRepository from './base'
import ErrorRepository from './error'

class SessionRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'session'
    this.key = 'repository:session'
    this.ttl = 1000 * 60 * 60 * 24 * 30 // 1 month
    this.responseKeys = ['csrfToken', 'userId', 'team']
    this.routes.create.path = '/api/session'
    this.routes.destroy.path = '/api/session'
  }
}

const repository = new SessionRepository()
repository.errorHandler = ErrorRepository
export default repository
