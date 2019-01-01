const Folder = function (sequelize, DataTypes) {
  const Model = sequelize.define('Folder', {
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    deletable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'folders'
  })

  Model.prototype.apiData = function () {
    return {
      id: this.id,
      teamId: this.teamId,
      name: this.name,
      deletable: this.deletable
    }
  }

  Model.beforeDestroy(async (instance) => {
    if (instance.deletable === false) { throw new Error('this folder cannot be deleted') }
  })

  return Model
}

module.exports = Folder
