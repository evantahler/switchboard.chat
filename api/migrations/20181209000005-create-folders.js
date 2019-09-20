module.exports = {
  up: async function (migration, DataTypes) {
    await migration.createTable('folders', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,

      teamId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(191),
        allowNull: false
      }
    }, {
      charset: 'utf8mb4'
    })

    await migration.addIndex('folders', ['teamId', 'name'], {
      unique: true,
      fields: ['teamId', 'name']
    })
  },

  down: async function (migration, DataTypes) {
    await migration.dropTable('folders')
  }
}
