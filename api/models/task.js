const { api } = require('actionhero')

const Task = function (sequelize, DataTypes) {
  const Model = sequelize.define('Task', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    contactId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    noteId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    assignedUserId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'tasks'
  })

  Model.prototype.user = async function () {
    return api.models.User.findOne({ where: { id: this.userId } })
  }

  Model.prototype.contact = async function () {
    return api.models.Contact.findOne({ where: { id: this.contactId } })
  }

  Model.prototype.assignedUser = async function () {
    if (!this.assignedUserId) { return null }
    return api.models.User.findOne({ where: { id: this.assignedUserId } })
  }

  Model.prototype.apiData = async function () {
    const user = await this.user()
    const assignedUser = await this.assignedUser()
    const contact = await this.contact()

    return {
      id: this.id,
      type: 'task',
      createdAt: this.createdAt,
      completedAt: this.completedAt,
      contactId: this.contactId,
      userId: this.userId,
      teamId: this.teamId,
      noteId: this.noteId,
      title: this.title,
      description: this.description,
      user: user.apiData(),
      assignedUser: assignedUser.apiData(),
      contact: contact.apiData()
    }
  }

  return Model
}

module.exports = Task
