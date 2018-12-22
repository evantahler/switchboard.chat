import BaseRepository from './base'
import SuccessRepository from './success'
import ErrorRepository from './error'
import SessionRepository from './session'

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
repository.successHandler = SuccessRepository
repository.errorHandler = ErrorRepository
repository.includeParamsInRequests = async () => {
  const { csrfToken } = await SessionRepository.get()
  return { csrfToken }
}
export default repository
