import BaseRepository from './base'
import SuccessRepository from './success'
import ErrorRepository from './error'
import SessionRepository from './session'

class TeamRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'team'
    this.ttl = 1000 * 60 * 60 * 24 // 1 day
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

    this.loadBillingInformation = async () => {
      const params = await this.mergeAdditionalParams({})
      const { card } = await this.client.action('get', '/api/team/billing', params)
      return card
    }
  }
}

const repository = new TeamRepository()
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
