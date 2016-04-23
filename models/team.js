module.exports = function(sequelize, DataTypes){
  return sequelize.define("team", {
    'name': {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    'areaCode': {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    'phoneNumber': {
      type: DataTypes.STRING(191),
      allowNull: true,
    },
    'sid': {
      type: DataTypes.STRING(191),
      allowNull: true,
    },
    'promoCode': {
      type: DataTypes.STRING(191),
      allowNull: true,
    },
    'stripeToken': {
      type: DataTypes.STRING(191),
      allowNull: true,
    },
    'pricePerMonth': {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    'pricePerMessage': {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
    ,'includedMessagesPerMonth': {
      type: DataTypes.INTEGER,
      allowNull: false,
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
