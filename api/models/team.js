const { api } = require('actionhero')

const Team = function (sequelize, DataTypes) {
  const Model = sequelize.define('Team', {
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
  }, {
    tableName: 'teams'
  })

  Model.prototype.addFolder = async function (folderName) {
    const folder = new api.models.Folder({
      teamId: this.id,
      name: folderName
    })

    return folder.save()
  }

  Model.prototype.removeFolder = async function (folderName) {
    const folder = await api.models.Folder.findOne({ where: {
      teamId: this.id,
      name: folderName
    } })

    if (!folder) { throw new Error('folder not found') }
    return folder.destroy()
  }

  Model.prototype.folders = async function () {
    return api.models.Folder.findAll({ where: { teamId: this.id } })
  }

  Model.prototype.users = async function () {
    return api.models.User.findAll({ where: { teamId: this.id } })
  }

  Model.prototype.contacts = async function (folderName) {
    const folder = await api.models.Folder.findOne({ where: {
      teamId: this.id,
      name: folderName
    } })

    if (!folder) { throw new Error('folder not found') }

    return api.models.Contact.findAll({ where: { folderId: folder.id } })
  }

  Model.prototype.apiData = function () {
    return {
      id: this.id,
      name: this.name,
      phoneNumber: this.phoneNumber,
      areaCode: this.areaCode,
      sid: this.sid,
      enabled: this.enabled
    }
  }

  return Model
}

module.exports = Team
