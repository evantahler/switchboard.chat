module.exports = function(sequelize, DataTypes){
  return sequelize.define("message", {
    'from': {
      type: DataTypes.STRING,
      allowNull: false,
    },
    'to': {
      type: DataTypes.STRING,
      allowNull: false,
    },
    'message': {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    'direction': {
      type: DataTypes.STRING,
      allowNull: false,
    },
    'read': {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {
    instanceMethods: {
      apiData: function(api){
        return {
          id:         this.id,
          from:       this.from,
          to:         this.to,
          message:    this.message,
          direction:  this.direction,
          read:       this.read,
          createdAt:  this.createdAt,
        };
      }
    }
  });
};