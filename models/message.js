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
    'teamId': {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    indexes: [
      {
        unique: false,
        fields: ['from']
      },
      {
        unique: false,
        fields: ['to']
      },
      {
        unique: false,
        fields: ['read']
      },
      {
        unique: false,
        fields: ['teamId']
      },
    ],

    instanceMethods: {
      apiData: function(api){
        return {
          id:         this.id,
          from:       this.from,
          to:         this.to,
          message:    this.message,
          direction:  this.direction,
          read:       this.read,
          teamId:     this.teamId,
          createdAt:  this.createdAt,
        };
      }
    }
  });
};