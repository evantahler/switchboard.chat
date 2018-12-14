const Contact = function (sequelize, DataTypes) {
  const Model = sequelize.define('Contact', {
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
  }, {
    tableName: 'contacts'
  })

  Model.prototype.name = function () {
    return [this.firstName, this.lastName].join(' ')
  }

  Model.prototype.apiData = function () {
    return {
      id: this.id,
      folderId: this.folderId,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      canUseCommands: this.canUseCommands
    }
  }

  return Model
}

module.exports = Contact
