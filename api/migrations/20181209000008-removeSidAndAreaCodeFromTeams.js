module.exports = {
  up: async function (migration, DataTypes) {
    await migration.removeColumn('teams', 'sid')
    await migration.removeColumn('teams', 'areaCode')
  },

  down: async function (migration, DataTypes) {
    await migration.addColumn('teams', 'sid')
    await migration.addColumn('teams', 'areaCode')
  }
}
