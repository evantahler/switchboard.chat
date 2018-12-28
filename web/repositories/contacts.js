import BaseRepository from './base'
import SuccessRepository from './success'
import ErrorRepository from './error'
import SessionRepository from './session'

class ContactsRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'contacts'
    this.key = 'repository:contacts'
    this.responseKeys = ['contacts']
    this.routes.get.path = '/api/contacts'
    this.routes.create.path = '/api/contact'
    this.routes.update.path = '/api/contact'
    this.routes.destroy.path = '/api/contact'
  }
}

const repository = new ContactsRepository()
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
