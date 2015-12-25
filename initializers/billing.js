module.exports = {
  initialize: function(api, next){
    api.billing = {
      promoCode: api.config.billing.promoCode,
      includedMessagesPerMonth: api.config.billing.includedMessagesPerMonth,
      pricePerMessage: api.config.billing.pricePerMessage,
      pricePerMonth: api.config.billing.pricePerMonth,

      calculateMonthlyBill: function(messageCount){
        var bill = 0;
        bill = bill + api.billing.pricePerMonth;
        if(messageCount > api.billing.includedMessagesPerMonth){
          var overageCount = (messageCount - api.billing.includedMessagesPerMonth);
          bill = bill + (overageCount * api.billing.pricePerMessage);
        }

        return bill;
      },

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
