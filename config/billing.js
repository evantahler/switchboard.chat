exports.default = {
  billing: function(api){
    return {
      promoCode: process.env.PROMO_CODE,
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