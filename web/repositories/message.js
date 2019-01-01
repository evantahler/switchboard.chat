import BaseRepository from './base'
import SuccessRepository from './success'
import ErrorRepository from './error'
import SessionRepository from './session'
import ContactRepository from './contact'

class UserRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'message'
    this.key = 'repository:message'
    this.responseKeys = ['message']
    this.routes.create.path = '/api/message'
  }

  // concact information will come in full from the form
  async hydrate (contact) {
    await this.set({ contact })
  }
}

const repository = new UserRepository()
repository.successHandler = SuccessRepository
repository.errorHandler = ErrorRepository
repository.includeParamsInRequests = async () => {
  const session = await SessionRepository.get()
  const contactResponse = await ContactRepository.get()
  return {
    csrfToken: session ? session.csrfToken : '',
    teamId: session && session.team ? session.team.id : null,
    contactId: contactResponse && contactResponse.contact ? contactResponse.contact.id : null
  }
}

export default repository
