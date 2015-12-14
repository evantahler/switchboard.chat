module.exports = function(sequelize, DataTypes){
  return sequelize.define("team", {
    'name': {
      type: DataTypes.STRING,
      allowNull: false,
    },
    'areaCode': {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    'phoneNumber': {
      type: DataTypes.STRING,
      allowNull: true,
    },
    'sid': {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['name']
      },
    ],
    
    instanceMethods: {
      apiData: function(api){
        return {
          id:          this.id,
          name:        this.name,
          phoneNumber: this.phoneNumber,
          areaCode:    this.areaCode,
          sid:         this.sid,
        };
      }
    }
  });
};