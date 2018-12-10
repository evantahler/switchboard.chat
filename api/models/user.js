const bcrypt = require('bcrypt')
const saltRounds = 10

const User = function (sequelize, DataTypes) {
  return sequelize.define('User', {
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
  })
}

User.prototype.name = () => {
  return [this.firstName, this.lastName].join(' ')
}

User.prototype.updatePassword = async (password) => {
  if (!password) { throw new Error('passord required') }
  this.passwordHash = bcrypt.hash(password, saltRounds)
  await this.save()
  return this.passwordHash
}

User.prototype.checkPassword = async (password) => {
  return bcrypt.compare(password, this.passwordHash)
}

User.prototype.apiData = (api) => {
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

module.exports = User
