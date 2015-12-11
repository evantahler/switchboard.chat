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
      allowNull: false,
    },
    'sid': {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
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