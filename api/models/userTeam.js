const Contact = function (sequelize, DataTypes) {
  const Model = sequelize.define('UserTeam', {
    'userId': {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    'teamId': {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'userTeams'
  })

  Model.prototype.apiData = function () {
    return {
      id: this.id,
      userId: this.userId,
      teamId: this.teamId
    }
  }

  return Model
}

module.exports = Contact
