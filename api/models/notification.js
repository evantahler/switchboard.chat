const Notification = function (sequelize, DataTypes) {
  const Model = sequelize.define('Notification', {
    'userId': {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    'notifyByEmail': {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    'notifyBySMS': {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    'notificationDelayMinutesSMS': {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 30
    },
    'notificationDelayMinutesEmail': {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 60
    },
    'lastEmailNotificationAt': {
      type: DataTypes.DATE,
      allowNull: true
    },
    'lastSMSNotificationAt': {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'notifications'
  })

  Model.prototype.apiData = function () {
    return {
      id: this.id,
      userId: this.userId,
      notifyByEmail: this.notifyByEmail,
      notifyBySMS: this.notifyBySMS,
      notificationDelayMinutesSMS: this.notificationDelayMinutesSMS,
      notificationDelayMinutesEmail: this.notificationDelayMinutesEmail
    }
  }

  return Model
}

module.exports = Notification
