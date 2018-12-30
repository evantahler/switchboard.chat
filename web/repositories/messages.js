import BaseRepository from './base'
import SuccessRepository from './success'
import ErrorRepository from './error'
import SessionRepository from './session'

class MessagesRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'messages'
    this.key = 'repository:messages'
    this.responseKeys = ['messages']
    this.routes.get.path = '/api/messages'
    this.routes.create.path = '/api/message'
  }
}

const repository = new MessagesRepository()
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
