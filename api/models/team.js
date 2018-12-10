const Team = function (sequelize, DataTypes) {
  return sequelize.define('team', {
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
}

Team.prototype.apiData = (api) => {
  return {
    id: this.id,
    name: this.name,
    phoneNumber: this.phoneNumber,
    areaCode: this.areaCode,
    sid: this.sid,
    enabled: this.enabled
  }
}

module.exports = Team
