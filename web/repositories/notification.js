import BaseRepository from './base'
import ErrorRepository from './error'
import SuccessRepository from './success'
import SessionRepository from './session'

class UserRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'notification'
    this.key = 'repository:notification'
    this.responseKeys = ['notification']
    this.routes.update.path = '/api/notification'
  }

  // concact information will come in full from the form
  async hydrate (notification) {
    await this.set({ notification })
  }
}

const repository = new UserRepository()
repository.errorHandler = ErrorRepository
repository.successHandler = SuccessRepository
repository.includeParamsInRequests = async () => {
  const session = await SessionRepository.get()
  return {
    csrfToken: session ? session.csrfToken : ''
  }
}

export default repository
