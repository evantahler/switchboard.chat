const ActionHero = require('actionhero')
const path = require('path')

const packageJSON = require(path.join(__dirname, '..', '..', 'package.json'))
const sha = require('child_process').execSync('git rev-parse HEAD').toString().trim()

module.exports = class SystemVersion extends ActionHero.Action {
  constructor () {
    super()
    this.name = 'system:version'
    this.description = 'return the package version and git sha'
    this.outputExample = {}
  }

  async run (data) {
    const api = ActionHero.api

    data.response.sha = sha
    data.response.id = api.id
    data.response.actionheroVersion = api.actionheroVersion
    data.response.name = packageJSON.name
    data.response.description = packageJSON.description
    data.response.version = packageJSON.version
  }
}
