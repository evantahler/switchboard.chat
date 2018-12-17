import BaseRepository from './base'
import ErrorRepository from './error'

class UserRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'user'
    this.key = 'repository:user'
    this.responseKeys = ['user']
    this.routes.create.path = '/api/user'
    this.routes.get.path = '/api/user'
    this.routes.update.path = '/api/user'
  }
}

const repository = new UserRepository()
repository.errorHandler = ErrorRepository
export default repository
