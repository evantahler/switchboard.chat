exports.default = {
  billing: function(api){
    return {
      promoCode: process.env.PROMO_CODE,
      includedMessagesPerMonth: 100,
      pricePerMessage: 0.01,
      pricePerMonth: 10.00,
    };
  }
};

exports.test = {
  billing: function(api){
    return {
      promoCode: 'PROMO_CODE',
    };
  }
};