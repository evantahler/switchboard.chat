const Contact = function (sequelize, DataTypes) {
  return sequelize.define('contact', {
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
    },
    'canUseCommands': {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }
  })
}

Contact.prototype.apiData = (api) => {
  return {
    id: this.id,
    teamId: this.teamId,
    folderId: this.folderId,
    firstName: this.firstName,
    lastName: this.lastName,
    phoneNumber: this.phoneNumber,
    canUseCommands: this.canUseCommands
  }
}

module.exports = Contact
