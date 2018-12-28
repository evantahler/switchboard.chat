module.exports = {
  up: async function (migration, DataTypes) {
    await migration.addColumn('teams', 'voiceResponse', {
      type: DataTypes.TEXT('medium'),
      allowNull: false
    })
  },

  down: async function (migration, DataTypes) {
    await migration.removeColumn('teams', 'voiceResponse')
  }
}
