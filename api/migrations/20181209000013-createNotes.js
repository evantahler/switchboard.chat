module.exports = {
  up: async function (migration, DataTypes) {
    await migration.createTable('notes', {
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
      contactId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      teamId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    })
  },

  down: async function (migration, DataTypes) {
    await migration.dropTable('messages')
  }
}
