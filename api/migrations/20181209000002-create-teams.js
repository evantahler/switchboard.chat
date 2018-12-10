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
        allowNull: false
      },
      phoneNumber: {
        type: DataTypes.STRING(191),
        allowNull: true
      },
      sid: {
        type: DataTypes.STRING(191),
        allowNull: true
      },
      promoCode: {
        type: DataTypes.STRING(191),
        allowNull: true
      },
      stripeToken: {
        type: DataTypes.STRING(191),
        allowNull: true
      },
      pricePerMonth: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      pricePerMessage: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      includedMessagesPerMonth: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        default: true
      }
    })

    await migration.addIndex('teams', ['name'], {
      indicesType: 'UNIQUE'
    })
  },

  down: async function (migration, DataTypes) {
    await migration.dropTable('teams')
  }
}
