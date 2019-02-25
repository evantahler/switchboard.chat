module.exports = {
  up: async function (migration, DataTypes) {
    await migration.createTable('teamMembers', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      teamId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      charset: 'utf8mb4'
    })

    await migration.addIndex('teamMembers', ['userId', 'teamId'], {
      indicesType: 'UNIQUE'
    })
  },

  down: async function (migration, DataTypes) {
    await migration.dropTable('teamMembers')
  }
}
