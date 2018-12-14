const { api } = require('actionhero')

class SpecHelper {
  async truncate () {
    const tables = await api.sequelize.sequelize.query('show tables', {
      type: api.sequelize.sequelize.QueryTypes.SELECT
    }).map((c) => { return Object.values(c)[0] })
    for (let i in tables) {
      let table = tables[i]
      if (table === 'SequelizeMeta') { continue }
      await api.sequelize.sequelize.query(`truncate ${table}`)
    }
  }
}

module.exports = SpecHelper
