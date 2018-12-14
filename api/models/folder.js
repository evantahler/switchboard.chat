const Folder = function (sequelize, DataTypes) {
  const Model = sequelize.define('Folder', {
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false
    }
  }, {
    tableName: 'folders'
  })

  Model.prototype.apiData = function () {
    return {
      id: this.id,
      teamId: this.teamId,
      name: this.name
    }
  }

  return Model
}

module.exports = Folder
