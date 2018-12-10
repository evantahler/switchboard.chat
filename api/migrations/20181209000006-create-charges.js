module.exports = {
  up: async function (migration, DataTypes) {
    await migration.createTable('charges', {
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
      paid: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      paidAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      refunded: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      refundedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      billingPeriod: {
        type: DataTypes.DATE,
        allowNull: true
      },
      type: {
        type: DataTypes.STRING(191),
        allowNull: false
      },
      valueInCents: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      unitValueInCents: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      unitCount: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      payload: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      discountValueInCents: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    })
  },

  down: async function (migration, DataTypes) {
    await migration.dropTable('charges')
  }
}
