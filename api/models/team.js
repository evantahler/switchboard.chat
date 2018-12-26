const { api } = require('actionhero')
const { Op } = require('sequelize')

const Team = function (sequelize, DataTypes) {
  const Model = sequelize.define('Team', {
    name: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    stripeCustomerId: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    billingEmail: {
      type: DataTypes.STRING(191),
      allowNull: false,
      validate: { isEmail: true }
    },
    pricePerMonth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3000
    },
    pricePerMessage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    includedMessagesPerMonth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1000
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'teams'
  })

  Model.prototype.addFolder = async function (folderName) {
    const folder = new api.models.Folder({ teamId: this.id, name: folderName })
    return folder.save()
  }

  Model.prototype.removeFolder = async function (folderId) {
    const folder = await api.models.Folder.findOne({ where: { teamId: this.id, id: folderId } })
    if (!folder) { throw new Error('folder not found') }
    return folder.destroy()
  }

  Model.prototype.folders = async function () {
    return api.models.Folder.findAll({ where: { teamId: this.id } })
  }

  Model.prototype.addTeamMember = async function ({ email, userId, firstName, lastName }) {
    let user
    if (userId) {
      user = await api.models.User.findOne({ where: { id: userId } })
    } else if (email) {
      user = await api.models.User.findOne({ where: { email } })
      if (!user) {
        user = new api.models.User({ email, firstName, lastName })
        await user.save()
      }
    } else {
      throw new Error('no way to find user')
    }

    if (!user) { throw new Error('user not found') }

    const teamMember = new api.models.TeamMember({ teamId: this.id, userId: user.id })
    return teamMember.save()
  }

  Model.prototype.removeTeamMember = async function (userId) {
    const teamMember = await api.models.TeamMember.findOne({ where: { teamId: this.id, userId } })
    if (!teamMember) { throw new Error('team member not found') }
    return teamMember.destroy()
  }

  Model.prototype.teamMembers = async function () {
    const teamMembers = await api.models.TeamMember.findAll({ where: { teamId: this.id } })
    return api.models.User.findAll({ where: {
      id: {
        [Op.in]: teamMembers.map(t => { return t.userId })
      }
    } })
  }

  Model.prototype.addContact = async function ({ firstName, lastName, phoneNumber, folderId }) {
    const folder = await api.models.Folder.findOne({ where: { teamId: this.id, id: folderId } })
    if (!folder) { throw new Error('folder not found') }
    const contact = new api.models.Contact({ firstName, lastName, phoneNumber, folderId: folder.id })
    return contact.save()
  }

  Model.prototype.removeContact = async function ({ contactId, folderId }) {
    const folder = await api.models.Folder.findOne({ where: { teamId: this.id, id: folderId } })
    if (!folder) { throw new Error('folder not found') }
    const contact = await api.models.Contact.findOne({ where: { folderId: folder.id, id: contactId } })
    if (!contact) { throw new Error('contact not found') }
    return contact.destroy()
  }

  Model.prototype.contacts = async function (folderId) {
    const folder = await api.models.Folder.findOne({ where: {
      teamId: this.id,
      id: folderId
    } })

    if (!folder) { throw new Error('folder not found') }

    return api.models.Contact.findAll({ where: { folderId: folder.id } })
  }

  Model.prototype.stats = async function () {
    const messagesIn = await api.models.Message.count({ where: { teamId: this.id, direction: 'in' } })
    const messagesOut = await api.models.Message.count({ where: { teamId: this.id, direction: 'out' } })

    return { messagesIn, messagesOut }
  }

  Model.prototype.apiData = function () {
    return {
      id: this.id,
      name: this.name,
      phoneNumber: this.phoneNumber,
      areaCode: this.areaCode,
      pricePerMonth: this.pricePerMonth,
      pricePerMessage: this.pricePerMessage,
      includedMessagesPerMonth: this.includedMessagesPerMonth,
      // sid: this.sid,
      enabled: this.enabled
    }
  }

  return Model
}

module.exports = Team
