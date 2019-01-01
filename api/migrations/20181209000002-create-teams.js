module.exports = {
  up: async function (migration, DataTypes) {
    await migration.createTable('teams', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,

      name: {
        type: DataTypes.STRING(191),
        allowNull: false
      },
      areaCode: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      phoneNumber: {
        type: DataTypes.STRING(191),
        allowNull: true
      },
      sid: {
        type: DataTypes.STRING(191),
        allowNull: true
      },
      stripeCustomerId: {
        type: DataTypes.STRING(191),
        allowNull: true
      },
      pricePerMonth: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3000
      },
      pricePerMessage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      includedMessagesPerMonth: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    }, {
      charset: 'utf8mb4'
    })

    await migration.addIndex('teams', ['name'], {
      indicesType: 'UNIQUE'
    })
  },

  down: async function (migration, DataTypes) {
    await migration.dropTable('teams')
  }
}
