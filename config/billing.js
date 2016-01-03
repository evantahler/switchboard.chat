exports.default = {
  billing: function(api){
    return {
      promoCode: process.env.PROMO_CODE,
      stripe_api_secret_key: process.env.STRIPE_API_SECRET_KEY,
      stripe_api_publishable_key: process.env.STRIPE_API_PUBLISHABLE_KEY,
      includedMessagesPerMonth: 100,
      pricePerMessage: 1,
      pricePerMonth: 1000,
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
