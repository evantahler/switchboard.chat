const Charge = function (sequelize, DataTypes) {
  const Model = sequelize.define('Charge', {
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
    totalInCents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    lineItems: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: JSON.stringify([])
    },
    payload: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'charges'
  })

  Model.prototype.apiData = function () {
    return {
      id: this.id,
      createdAt: this.createdAt,
      teamId: this.teamId,
      capturedAt: this.capturedAt,
      billingPeriodStart: this.billingPeriodStart,
      billingPeriodEnd: this.billingPeriodEnd,
      totalInCents: this.totalInCents,
      lineItems: this.lineItems,
      payload: this.payload
    }
  }

  return Model
}

module.exports = Charge
