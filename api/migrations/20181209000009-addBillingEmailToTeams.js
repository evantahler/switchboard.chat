module.exports = {
  up: async function (migration, DataTypes) {
    await migration.addColumn('teams', 'billingEmail', {
      type: DataTypes.STRING(191),
      allowNull: true,
      validate: { isEmail: true }
    })
  },

  down: async function (migration, DataTypes) {
    await migration.removeColumn('teams', 'billingEmail')
  }
}
