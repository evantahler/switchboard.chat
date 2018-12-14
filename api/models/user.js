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
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    tableName: 'users'
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

  Model.prototype.apiData = function () {
    return {
      id: this.id,
      teamId: this.teamId,
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
