import BaseRepository from './base'
import SuccessRepository from './success'
import ErrorRepository from './error'
import SessionRepository from './session'
import ContactRepository from './contact'

class TaskRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'task'
    this.ttl = 1000 * 60 * 60 * 24 // 1 day
    this.key = 'repository:task'
    this.responseKeys = ['task']
    this.routes.create.path = '/api/task'
    this.routes.update.path = '/api/task'
    this.routes.destroy.path = '/api/task'
  }

  // concact information will come in full from the contact list
  async hydrate (task) {
    await this.set({ task })
  }
}

const repository = new TaskRepository()
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
