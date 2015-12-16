exports.default = {
  billing: function(api){
    return {
      promoCode: process.env.PROMO_CODE,
    };
  }
};