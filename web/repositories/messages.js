import BaseRepository from './base'
import SuccessRepository from './success'
import ErrorRepository from './error'
import SessionRepository from './session'
import ContactRepository from './contact'

class MessagesRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'messages'
    this.ttl = 1000 * 60 // 1 minute
    this.key = 'repository:messages'
    this.responseKeys = ['messages']
    this.routes.get.path = '/api/messages'
    this.routes.create.path = '/api/message'
  }

  async setKey (contactI) {
    const contactResponse = await ContactRepository.get()
    if (contactResponse && contactResponse.contact) {
      this.key = `repository:messages:${contactResponse.contact.id}`
    } else {
      this.key = `repository:messages`
    }
  }
}

const repository = new MessagesRepository()
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
