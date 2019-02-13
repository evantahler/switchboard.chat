module.exports = {
  up: async function (migration, DataTypes) {
    await migration.createTable('notifications', {
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
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      medium: {
        type: DataTypes.STRING,
        allowNull: false
      },
      delayMiliseconds: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      notifiedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    }, {
      charset: 'utf8mb4'
    })

    await migration.addIndex('notifications', ['userId', 'teamId'], {
      indicesType: 'UNIQUE'
    })
  },

  down: async function (migration, DataTypes) {
    await migration.dropTable('notifications')
  }
}
