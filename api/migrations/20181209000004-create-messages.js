module.exports = {
  up: async function (migration, DataTypes) {
    await migration.createTable('messages', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,

      from: {
        type: DataTypes.STRING(191),
        allowNull: false
      },
      to: {
        type: DataTypes.STRING(191),
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      direction: {
        type: DataTypes.STRING(191),
        allowNull: false
      },
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      teamId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      charset: 'utf8mb4'
    })
  },

  down: async function (migration, DataTypes) {
    await migration.dropTable('messages')
  }
}
