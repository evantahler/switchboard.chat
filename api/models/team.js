const { api } = require('actionhero')
const { Op } = require('sequelize')
const uuidv4 = require('uuid/v4')
const mime = require('mime-types')

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
    voiceResponse: {
      type: DataTypes.TEXT('medium'),
      allowNull: false,
      defaultValue: 'We are sorry, but this number only accepts text messages.  Goodbye.'
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
    tableName: 'teams',
    paranoid: true
  })

  Model.afterDestroy(async (instance) => {
    instance.name = `${instance.name}-destroyed-${instance.id}`
    return instance.save()
  })

  Model.prototype.addFolder = async function (folderName) {
    const folder = new api.models.Folder({ teamId: this.id, name: folderName })
    return folder.save()
  }

  Model.prototype.updateFolder = async function ({ folderId, name }) {
    const folder = await api.models.Folder.findOne({ where: { teamId: this.id, id: folderId } })
    if (!folder) { throw new Error('folder not found') }
    if (name) { folder.name = name }
    return folder.save()
  }

  Model.prototype.removeFolder = async function (folderId) {
    const folder = await api.models.Folder.findOne({ where: { teamId: this.id, id: folderId } })
    if (!folder) { throw new Error('folder not found') }
    return folder.destroy()
  }

  Model.prototype.folders = async function () {
    return api.models.Folder.findAll({
      where: { teamId: this.id },
      order: [['name', 'asc']]
    })
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
    await teamMember.save()
    await api.models.Notification.findOrCreate({ where: { userId: teamMember.id, teamId: this.id } })
    return teamMember
  }

  Model.prototype.editTeamMember = async function ({ userId, email, firstName, lastName, phoneNumber }) {
    const teamMember = await api.models.TeamMember.findOne({ where: { teamId: this.id, userId } })
    if (!teamMember) { throw new Error('team member not found') }
    const user = await api.models.User.findOne({ where: { id: teamMember.userId } })

    if (email) { user.email = email }
    if (firstName) { user.firstName = firstName }
    if (lastName) { user.lastName = lastName }
    if (phoneNumber) { user.phoneNumber = phoneNumber }

    return user.save()
  }

  Model.prototype.removeTeamMember = async function (userId) {
    const teamMember = await api.models.TeamMember.findOne({ where: { teamId: this.id, userId } })
    if (!teamMember) { throw new Error('team member not found') }
    await api.models.Notification.destroy({ where: { userId: teamMember.id, teamId: this.id } })
    return teamMember.destroy()
  }

  Model.prototype.teamMembers = async function () {
    const teamMembers = await api.models.TeamMember.findAll({ where: { teamId: this.id } })
    return api.models.User.findAll({ where:
    {
      id: {
        [Op.in]: teamMembers.map(t => { return t.userId })
      }
    },
    order: [['lastName', 'asc'], ['firstName', 'asc']]
    })
  }

  Model.prototype.addContact = async function ({ firstName, lastName, phoneNumber, folderId }) {
    const folder = await api.models.Folder.findOne({ where: { teamId: this.id, id: folderId } })
    if (!folder) { throw new Error('folder not found') }
    const contact = new api.models.Contact({ firstName, lastName, phoneNumber, folderId: folder.id, teamId: this.id })
    return contact.save()
  }

  Model.prototype.updateContact = async function ({ contactId, firstName, lastName, phoneNumber, folderId }) {
    const contact = await api.models.Contact.findOne({ where: { id: contactId, teamId: this.id } })

    if (firstName) { contact.firstName = firstName }
    if (lastName) { contact.lastName = lastName }
    if (phoneNumber) { contact.phoneNumber = phoneNumber }

    if (folderId) {
      const folder = await api.models.Folder.findOne({ where: { teamId: this.id, id: folderId } })
      if (!folder) { throw new Error('folder not found') }
      contact.folderId = folderId
    }

    return contact.save()
  }

  Model.prototype.removeContact = async function ({ contactId, folderId }) {
    const folder = await api.models.Folder.findOne({ where: { teamId: this.id, id: folderId } })
    if (!folder) { throw new Error('folder not found') }
    const contact = await api.models.Contact.findOne({ where: { folderId: folder.id, id: contactId, teamId: this.id } })
    if (!contact) { throw new Error('contact not found') }
    return contact.destroy()
  }

  Model.prototype.contacts = async function (folderId) {
    let folderWhere = { teamId: this.id }
    if (folderId) { folderWhere.id = folderId }
    const folders = await api.models.Folder.findAll({ where: folderWhere })
    let contacts = api.models.Contact.findAll({
      where: {
        teamId: this.id,
        folderId: {
          [Op.in]: folders.map(f => f.id)
        }
      },
      order: [['lastName', 'asc'], ['firstName', 'asc']]
    })

    return contacts
  }

  Model.prototype.stats = async function () {
    const messagesIn = await api.models.Message.count({ where: { teamId: this.id, direction: 'in' } })
    const messagesOut = await api.models.Message.count({ where: { teamId: this.id, direction: 'out' } })

    return { messagesIn, messagesOut }
  }

  Model.prototype.addNote = async function (contact, user, body) {
    if (contact.teamId !== this.id) { throw new Error('contact is not a member of this team') }
    const note = new api.models.Note({
      message: body,
      teamId: this.id,
      contactId: contact.id,
      userId: user.id
    })

    return note.save()
  }

  Model.prototype.addMessage = async function (contact, body, attachment) {
    if (contact.teamId !== this.id) { throw new Error('contact is not a member of this team') }
    const message = new api.models.Message({
      from: this.phoneNumber,
      to: contact.phoneNumber,
      message: body,
      attachment: attachment,
      direction: 'out',
      read: false,
      teamId: this.id,
      contactId: contact.id
    })

    await message.save()

    try {
      let twilioData = { to: message.to, from: message.from, body }
      if (attachment) { twilioData.mediaUrl = attachment }
      await api.twilio.client.messages.create(twilioData)
    } catch (error) {
      await message.destroy()
      throw error
    }

    return message
  }

  Model.prototype.addTask = async function (contact, note, user, title, description, assignedUser) {
    if (contact.teamId !== this.id) { throw new Error('contact is not a member of this team') }
    if (note.teamId !== this.id) { throw new Error('note is not for this team') }

    const task = new api.models.Task({
      teamId: this.id,
      noteId: note.id,
      contactId: contact.id,
      userId: user.id,
      title,
      description,
      completedAt: null,
      assignedUserId: (assignedUser ? assignedUser.id : null)
    })

    return task.save()
  }

  Model.prototype.updateTask = async function ({ taskId, completedAt, title, description, assignedUser }) {
    const task = await api.models.Task.findOne({ where: { id: taskId, teamId: this.id } })

    if (completedAt) { task.completedAt = completedAt }
    if (title) { task.title = title }
    if (description) { task.description = description }
    if (assignedUser) { task.assignedUserId = assignedUser.id }

    return task.save()
  }

  Model.prototype.removeTask = async function ({ taskId }) {
    const task = await api.models.Task.findOne({ where: { id: taskId, teamId: this.id } })
    if (!task) { throw new Error('task not found') }
    return task.destroy()
  }

  Model.prototype.messagesAndNotes = async function (contact, limit = 100, offset = 0) {
    if (contact.teamId !== this.id) { throw new Error('contact is not a member of this team') }
    const messages = await api.models.Message.findAll({ where: { contactId: contact.id, teamId: this.id }, limit, offset })
    const notes = await api.models.Note.findAll({ where: { contactId: contact.id, teamId: this.id }, limit, offset })
    let orderedResults = [].concat(messages, notes)
    orderedResults.sort((a, b) => { return a.createdAt.getTime() - b.createdAt.getTime() })

    for (let i in messages) {
      let message = messages[i]
      if (message.read !== true) {
        message.read = true
        message.save() // actually, don't await here
      }
    }

    return orderedResults
  }

  Model.prototype.uploadFile = async function (localPath, originalFileName, contact) {
    if (contact.teamId !== this.id) { throw new Error('contact is not a member of this team') }
    const contentType = mime.lookup(originalFileName)
    const uuid = uuidv4()
    let remotePath = `team-${this.id}/contact-${contact.id}/${uuid}-${originalFileName}`
    console.log({ remotePath, localPath, contentType })
    return api.s3.uploadFile(remotePath, localPath, contentType)
  }

  Model.prototype.apiData = function () {
    return {
      id: this.id,
      name: this.name,
      phoneNumber: this.phoneNumber,
      billingEmail: this.billingEmail,
      voiceResponse: this.voiceResponse,
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
