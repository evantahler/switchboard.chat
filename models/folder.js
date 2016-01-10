module.exports = function(sequelize, DataTypes){
  return sequelize.define("folder", {
    'teamId': {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    'name': {
      type: DataTypes.STRING(191),
      allowNull: false,
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['teamId', 'name']
      },
      {
        unique: false,
        fields: ['teamId']
      },
    ],

    instanceMethods: {
      apiData: function(api){
        return {
          id:     this.id,
          teamId: this.teamId,
          name:   this.name
        };
      }
    }
  });
};
