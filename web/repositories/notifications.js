import BaseRepository from './base'
import SuccessRepository from './success'
import ErrorRepository from './error'
import SessionRepository from './session'

class NotificationRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'notifications'
    this.key = 'repository:notifications'
    this.responseKeys = ['notifications']
    this.routes.get.path = '/api/notifications'
  }
}

const repository = new NotificationRepository()
repository.successHandler = SuccessRepository
repository.errorHandler = ErrorRepository
repository.includeParamsInRequests = async () => {
  const session = await SessionRepository.get()
  return { csrfToken: session ? session.csrfToken : '' }
}

export default repository
