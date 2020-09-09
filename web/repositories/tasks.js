import BaseRepository from './base'
import SuccessRepository from './success'
import ErrorRepository from './error'
import SessionRepository from './session'
import ContactRepository from './contact'

class TasksRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'tasks'
    this.key = 'repository:tasks'
    this.responseKeys = ['tasks']
    this.routes.get.path = '/api/tasks'
  }

  async setKey () {
    const contactResponse = await ContactRepository.get()
    if (contactResponse && contactResponse.contact) {
      this.key = `repository:tasks:${contactResponse.contact.id}`
    } else {
      this.key = 'repository:tasks'
    }
  }
}

const repository = new TasksRepository()
repository.successHandler = SuccessRepository
repository.errorHandler = ErrorRepository
repository.includeParamsInRequests = async () => {
  const session = await SessionRepository.get()
  const contactResponse = await ContactRepository.get()

  return {
    csrfToken: session ? session.csrfToken : '',
    teamId: session && session.team ? session.team.id : null,
    contactId: contactResponse && contactResponse.contact ? contactResponse.contact.id : null,
    userId: contactResponse && contactResponse.contact ? null : session.userId
  }
}

export default repository
