import BaseRepository from './base'
import ErrorRepository from './error'

class VersionRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'version'
    this.key = 'repository:version'
    this.hydration.path = '/api/system/version'
  }
}

const repository = new VersionRepository()
repository.errorHandler = ErrorRepository
export default repository
