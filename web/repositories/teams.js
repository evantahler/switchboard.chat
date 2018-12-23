import BaseRepository from './base'
import SuccessRepository from './success'
import ErrorRepository from './error'
import SessionRepository from './session'

class UserRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'teams'
    this.key = 'repository:teams'
    this.responseKeys = ['teams']
    this.routes.get.path = '/api/teams'
  }
}

const repository = new UserRepository()
repository.successHandler = SuccessRepository
repository.errorHandler = ErrorRepository
repository.includeParamsInRequests = async () => {
  const session = await SessionRepository.get()
  return { csrfToken: session ? session.csrfToken : '' }
}
export default repository
