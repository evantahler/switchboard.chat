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
  }
}

const repository = new ContactsRepository()
repository.successHandler = SuccessRepository
repository.errorHandler = ErrorRepository
repository.includeParamsInRequests = async () => {
  const session = await SessionRepository.get()
  return {
    csrfToken: session ? session.csrfToken : '',
    teamId: session && session.team ? session.team.id : null,
    folderId: session && session.folder ? session.folder.id : null
  }
}

export default repository
