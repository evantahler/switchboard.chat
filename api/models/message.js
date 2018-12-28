const Message = function (sequelize, DataTypes) {
  const Model = sequelize.define('Message', {
    from: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    to: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    direction: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    contactId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'messages'
  })

  Model.prototype.apiData = function () {
    return {
      id: this.id,
      from: this.from,
      to: this.to,
      message: this.message,
      direction: this.direction,
      read: this.read,
      contactId: this.contactId,
      teamId: this.teamId,
      createdAt: this.createdAt
    }
  }

  return Model
}

module.exports = Message
