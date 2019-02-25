import BaseRepository from './base'
import SuccessRepository from './success'
import ErrorRepository from './error'
import SessionRepository from './session'

class TeamMembersRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'teamMembers'
    this.key = 'repository:teamMembers'
    this.responseKeys = ['teamMembers']
    this.routes.get.path = '/api/teamMembers'
  }
}

const repository = new TeamMembersRepository()
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
