import BaseRepository from './base'
import SuccessRepository from './success'
import ErrorRepository from './error'
import SessionRepository from './session'

class TeamMemberRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'folder'
    this.key = 'repository:folder'
    this.responseKeys = ['folder']
    this.routes.create.path = '/api/folder'
    this.routes.update.path = '/api/folder'
    this.routes.destroy.path = '/api/folder'
  }

  // concact information will come in full from the folders list
  async hydrate (folder) {
    await this.set({ folder })
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
