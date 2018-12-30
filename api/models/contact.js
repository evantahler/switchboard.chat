const { api } = require('actionhero')

const Contact = function (sequelize, DataTypes) {
  const Model = sequelize.define('Contact', {
    'teamId': {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    'folderId': {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    'firstName': {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    'lastName': {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    'phoneNumber': {
      type: DataTypes.STRING(191),
      allowNull: false
    }
  }, {
    tableName: 'contacts',
    paranoid: true
  })

  Model.prototype.name = function () {
    return [this.firstName, this.lastName].join(' ')
  }

  Model.prototype.mostRecentMessage = async function () {
    const mostRecentMessage = await api.models.Message.findOne({
      where: { contactId: this.id },
      order: [[ 'createdAt', 'desc' ]]
    })

    if (mostRecentMessage) { return mostRecentMessage.createdAt }
    return null
  }

  Model.prototype.apiData = async function () {
    return {
      id: this.id,
      teamId: this.teamId,
      folderId: this.folderId,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      mostRecentMessage: await this.mostRecentMessage()
    }
  }

  return Model
}

module.exports = Contact
