module.exports = {
  up: async function (migration, DataTypes) {
    await migration.createTable('contacts', {
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
      folderId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING(191),
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING(191),
        allowNull: false
      },
      phoneNumber: {
        type: DataTypes.STRING(191),
        allowNull: false
      },
      canUseCommands: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    })

    await migration.addIndex('contacts', ['phoneNumber', 'teamId'], {
      indicesType: 'UNIQUE'
    })
  },

  down: async function (migration, DataTypes) {
    await migration.dropTable('contacts')
  }
}
