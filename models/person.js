module.exports = function(sequelize, DataTypes){
  return sequelize.define("person", {
    'teamId': {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    'firstName': {
      type: DataTypes.STRING,
      allowNull: false,
    },
    'lastName': {
      type: DataTypes.STRING,
      allowNull: false,
    },
    'phoneNumber': {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['teamId', 'phoneNumber']
      },
    ],

    instanceMethods: {
      apiData: function(api){
        return {
          id:          this.id,
          teamId:      this.teamId,
          firstName:   this.firstName,
          lastName:    this.lastName,
          phoneNumber: this.phoneNumber,
        };
      }
    }
  });
};