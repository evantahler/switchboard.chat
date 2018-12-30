import BaseRepository from './base'
import SuccessRepository from './success'
import ErrorRepository from './error'
import SessionRepository from './session'

class UserRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'contact'
    this.key = 'repository:contact'
    this.responseKeys = ['contact']
    this.routes.create.path = '/api/contact'
  }
}

const repository = new UserRepository()
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
