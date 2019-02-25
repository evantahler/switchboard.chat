import BaseRepository from './base'
import ErrorRepository from './error'

class VersionRepository extends BaseRepository {
  constructor () {
    super()
    this.name = 'version'
    this.key = 'repository:version'
    this.responseKeys = ['sha', 'version', 'name', 'id', 'desciption']
    this.routes.get.path = '/api/system/version'
  }
}

const repository = new VersionRepository()
repository.errorHandler = ErrorRepository
export default repository
