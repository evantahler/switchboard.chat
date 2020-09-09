module.exports = {
  up: async function (migration, DataTypes) {
    await migration.addColumn('messages', 'attachment', {
      type: DataTypes.TEXT,
      allowNull: true
    })
  },

  down: async function (migration, DataTypes) {
    await migration.removeColumn('messages', 'attachment')
  }
}
