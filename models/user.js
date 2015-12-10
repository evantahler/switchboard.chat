var bcrypt = require('bcrypt');
var bcryptComplexity = 10;

module.exports = function(sequelize, DataTypes){
  return sequelize.define("user", {
    'email': {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true }, 
    },
    'passwordHash': {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    'passwordSalt': {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    'role': {
      type: DataTypes.STRING,
      allowNull: true,
    },
    'phoneNumber': {
      type: DataTypes.STRING,
      allowNull: true,
    },
    'firstName': {
      type: DataTypes.STRING,
      allowNull: false,
    },
    'lastName': {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['email']
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
          id:        this.id,
          email:     this.email,
          role:      this.role,
          firstName: this.firstName,
          lastName:  this.lastName,
        };
      }
    }
  });
};