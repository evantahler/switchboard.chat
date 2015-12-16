module.exports = {
  initialize: function(api, next){
    api.billing = {
      promoCode: api.config.billing.promoCode,

      register: function(team, callback){
        if(api.billing.promoCode && team.promoCode){
          if(team.promoCode === api.billing.promoCode){
            return callback();
          }else{
            return callback(new Error(team.promoCode + ' is not a valid promotional code.'));
          }
        }else{
          // TODO
          return callback(new Error('We are not accepting new customers at this time'));
        }
      }
    };

    next();
  }
};
