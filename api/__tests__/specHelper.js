const { api } = require('actionhero')

// mock all vendor connection vendorOperations
jest.mock('./../vendorOperations/teamRegister.js') //eslint-disable-line

class SpecHelper {
  async truncate () {
    const tables = await api.sequelize.sequelize.query('show tables', {
      type: api.sequelize.sequelize.QueryTypes.SELECT
    }).map((c) => { return Object.values(c)[0] })
    for (const i in tables) {
      const table = tables[i]
      if (table === 'SequelizeMeta') { continue }
      await api.sequelize.sequelize.query(`truncate ${table}`)
    }
  }
}

module.exports = SpecHelper
