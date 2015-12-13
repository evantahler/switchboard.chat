var bcrypt = require('bcrypt');
var bcryptComplexity = 10;

module.exports = function(sequelize, DataTypes){
  return sequelize.define("user", {
    'email': {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true }, 
    },
    'phoneNumber': {
      type: DataTypes.STRING,
      allowNull: true,
    },
    'teamId': {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    'passwordHash': {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    'passwordSalt': {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    'firstName': {
      type: DataTypes.STRING,
      allowNull: false,
    },
    'lastName': {
      type: DataTypes.STRING,
      allowNull: false,
    },
    'lastLoginAt': {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        unique: true,
        fields: ['phoneNumber']
      },
      {
        unique: false,
        fields: ['teamId']
      },
    ],

    instanceMethods: {
      name: function(){
        return [this.firstName, this.lastName].join(' ');
      },

      updatePassword: function(pw, callback){
        var self = this;

        if(!pw){ return callback(); }

        var salt = bcrypt.genSalt(bcryptComplexity, function(error, salt){
          if(error){ return callback(error); }
          bcrypt.hash(pw, salt, function(error, hash){
            if(error){ return callback(error); }
            self.passwordHash = hash;
            self.passwordSalt = salt;
            callback(null, self);
          });
        });
      },

      checkPassword: function(pw, callback){
        var self = this;
        bcrypt.compare(pw, self.passwordHash, callback);
      },

      apiData: function(api){
        return {
          id:          this.id,
          teamId:      this.teamId,
          email:       this.email,
          phoneNumber: this.phoneNumber,
          firstName:   this.firstName,
          lastName:    this.lastName,
        };
      }
    }
  });
};