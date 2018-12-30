const { api } = require('actionhero')
const { Op } = require('sequelize')
const bcrypt = require('bcrypt')
const saltRounds = 10

const User = function (sequelize, DataTypes) {
  const Model = sequelize.define('User', {
    email: {
      type: DataTypes.STRING(191),
      allowNull: false,
      validate: { isEmail: true }
    },
    phoneNumber: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    passwordHash: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    passwordResetToken: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    requirePasswordChange: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    firstName: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'users',
    paranoid: true
  })

  Model.prototype.name = function () {
    return [this.firstName, this.lastName].join(' ')
  }

  Model.prototype.updatePassword = async function (password) {
    if (!password) { throw new Error('password required') }
    this.passwordHash = await bcrypt.hash(password, saltRounds)
    await this.save()
  }

  Model.prototype.checkPassword = async function (password) {
    return bcrypt.compare(password, this.passwordHash)
  }

  Model.prototype.joinTeam = async function (team) {
    const teamMembership = new api.models.TeamMember({ userId: this.id, teamId: team.id })
    return teamMembership.save()
  }

  Model.prototype.leaveTeam = async function (team) {
    const teamMembership = await api.models.TeamMember.findOne({
      where: { userId: this.id, teamId: team.id }
    })
    return teamMembership.destroy()
  }

  Model.prototype.teams = async function () {
    const teamMemberships = await api.models.TeamMember.findAll({
      where: { userId: this.id }
    })

    return api.models.Team.findAll({ where: {
      id: {
        [Op.in]: teamMemberships.map(t => { return t.teamId })
      }
    } })
  }

  Model.prototype.apiData = function () {
    return {
      id: this.id,
      email: this.email,
      phoneNumber: this.phoneNumber,
      firstName: this.firstName,
      lastName: this.lastName,
      requirePasswordChange: this.requirePasswordChange
    }
  }

  return Model
}

module.exports = User
