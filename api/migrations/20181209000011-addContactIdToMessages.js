module.exports = {
  up: async function (migration, DataTypes) {
    await migration.addColumn('messages', 'contactId', {
      type: DataTypes.INTEGER,
      allowNull: false
    })
  },

  down: async function (migration, DataTypes) {
    await migration.removeColumn('messages', 'contactId')
  }
}
