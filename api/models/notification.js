const { api } = require('actionhero')

const Notification = function (sequelize, DataTypes) {
  const Model = sequelize.define('Notification', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    medium: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'email'
    },
    delayMiliseconds: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: (1000 * 60 * 5)
    },
    notifiedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'notifications'
  })

  Model.prototype.team = async function () {
    return api.models.Team.findOne({ where: { id: this.teamId } })
  }

  Model.prototype.apiData = async function () {
    const team = await this.team()

    return {
      id: this.id,
      userId: this.userId,
      teamId: this.teamId,
      enabled: this.enabled,
      medium: this.medium,
      delayMiliseconds: this.delayMiliseconds,
      notifiedAt: this.notifiedAt,
      team: team
    }
  }

  Model.allowedMediums = function () {
    return ['sms', 'email']
  }

  return Model
}

module.exports = Notification
