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
      capturedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      billingPeriodStart: {
        type: DataTypes.DATE,
        allowNull: false
      },
      billingPeriodEnd: {
        type: DataTypes.DATE,
        allowNull: false
      },
      totalMessages: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      totalInCents: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      lineItems: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      payload: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, {
      charset: 'utf8mb4'
    })
  },

  down: async function (migration, DataTypes) {
    await migration.dropTable('charges')
  }
}
