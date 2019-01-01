module.exports = {
  up: async function (migration, DataTypes) {
    await migration.addColumn('folders', 'deletable', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    })
  },

  down: async function (migration, DataTypes) {
    await migration.removeColumn('folders', 'deletable')
  }
}
