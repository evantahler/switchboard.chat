import BaseRepository from './base'
import SuccessRepository from './success'
import ErrorRepository from './error'
import SessionRepository from './session'

class TeamMemberRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'teamMember'
    this.key = 'repository:teamMember'
    this.responseKeys = ['teamMember']
    this.routes.create.path = '/api/teamMember'
    this.routes.update.path = '/api/teamMember'
    this.routes.destroy.path = '/api/teamMember'
  }

  // concact information will come in full from the contact list
  async hydrate (teamMember) {
    await this.set({ teamMember })
  }
}

const repository = new TeamMemberRepository()
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
