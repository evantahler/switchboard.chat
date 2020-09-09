module.exports = {
  up: async function (migration, DataTypes) {
    await migration.createTable('tasks', {
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
      contactId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      noteId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      assignedUserId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      title: {
        type: DataTypes.STRING(191),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    }, {
      charset: 'utf8mb4'
    })
  },

  down: async function (migration, DataTypes) {
    await migration.dropTable('messages')
  }
}
