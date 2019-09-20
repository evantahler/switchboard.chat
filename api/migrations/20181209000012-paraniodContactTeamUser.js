const { Op } = require('sequelize')

module.exports = {
  up: async function (migration, DataTypes) {
    // contacts
    await migration.addColumn('contacts', 'teamId', {
      type: DataTypes.INTEGER,
      allowNull: false
    })

    await migration.addColumn('contacts', 'deletedAt', {
      type: DataTypes.DATE,
      allowNull: true
    })

    await migration.removeIndex('contacts', ['phoneNumber', 'folderId'])
    await migration.addIndex('contacts', ['phoneNumber', 'teamId'], {
      indicesType: 'UNIQUE',
      where: { deletedAt: { [Op.ne]: null } }
    })

    // teams

    await migration.addColumn('teams', 'deletedAt', {
      type: DataTypes.DATE,
      allowNull: true
    })

    await migration.removeIndex('teams', ['name'])
    await migration.addIndex('teams', ['name'], {
      unique: true,
      fields: 'name',
      where: {  deletedAt: { [Op.ne]: null } }
    })

    // users

    await migration.addColumn('users', 'deletedAt', {
      type: DataTypes.DATE,
      allowNull: true
    })

    await migration.removeIndex('users', ['email'])
    await migration.addIndex('users', ['email'], {
      indicesType: 'UNIQUE',
      where: { deletedAt: { [Op.ne]: null } }
    })

    await migration.removeIndex('users', ['phoneNumber'])
    await migration.addIndex('users', ['phoneNumber'], {
      indicesType: 'UNIQUE',
      where: { deletedAt: { [Op.ne]: null } }
    })
  },

  down: async function (migration, DataTypes) {
    await migration.removeIndex('contacts', ['phoneNumber', 'teamId'])
    await migration.removeColumn('contacts', 'deletedAt')
    await migration.removeColumn('contacts', 'teamId')

    await migration.removeIndex('teams', ['name'])
    await migration.removeColumn('teams', 'deletedAt')

    await migration.removeIndex('users', ['email'])
    await migration.removeIndex('users', ['phoneNumber'])
    await migration.removeColumn('users', 'deletedAt')
  }
}
