const Folder = function (sequelize, DataTypes) {
  return sequelize.define('folder', {
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false
    }
  })
}

Folder.prototype.apiData = (api) => {
  return {
    id: this.id,
    teamId: this.teamId,
    name: this.name
  }
}

Folder.teamFolders = async (team) => {
  return Folder.findAll.where({ teamId: team.id })
}

module.exports = Folder
