const { api } = require('actionhero')

const Note = function (sequelize, DataTypes) {
  const Model = sequelize.define('Note', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    contactId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'notes'
  })

  Model.prototype.user = async function () {
    return api.models.User.findOne({ where: { id: this.userId } })
  }

  Model.prototype.apiData = async function () {
    const user = await this.user()

    return {
      id: this.id,
      type: 'note',
      createdAt: this.createdAt,
      contactId: this.contactId,
      teamId: this.teamId,
      userId: this.userId,
      message: this.message,
      user: user.apiData()
    }
  }

  return Model
}

module.exports = Note
