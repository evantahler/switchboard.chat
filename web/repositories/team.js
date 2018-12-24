import BaseRepository from './base'
import SuccessRepository from './success'
import ErrorRepository from './error'
import SessionRepository from './session'

class UserRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'team'
    this.key = 'repository:team'
    this.responseKeys = ['team']
    this.routes.create.path = '/api/team'
    this.routes.get.path = '/api/team'
    this.routes.update.path = '/api/team'

    this.loadPhoneNumbers = async (areaCode) => {
      const params = await this.mergeAdditionalParams({ areaCode })
      const phoneNumbers = this.client.action('get', '/api/twilio/listNumbers', params)
      if (phoneNumbers.length === 0) { ErrorRepository.set('No phone numbers found') }
      return phoneNumbers
    }
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
