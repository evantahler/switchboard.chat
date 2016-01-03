module.exports = function(sequelize, DataTypes){

  return sequelize.define("charge", {
    'teamId': {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    'paid': {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    'paidAt': {
      type: DataTypes.DATE,
      allowNull: true,
    },
    'billingPeriod': {
      type: DataTypes.DATE,
      allowNull: true,
    },
    'type': {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    'valueInCents': {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    'unitValueInCents': {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    'unitCount': {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    'payload': {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    'description': {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    'discountValueInCents': {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

  }, {
    instanceMethods: {
      apiData: function(api){
        return {
          id:                 this.id,
          createdAt:          this.createdAt,
          teamId:             this.teamId,
          paid:               this.paid,
          paidAt:             this.paidAt,
          type:               this.type,
          valueInCents:       this.valueInCents,
          unitValueInCents:   this.unitValueInCents,
          unitCount:          this.unitCount,
          description:        this.description,
          discountValueInCents: this.discountValueInCents,
        };
      }
    }
  });
};
