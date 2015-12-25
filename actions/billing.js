exports.billingRates = {
  name:                   'billing:rates',
  description:            'billing:rates',
  outputExample:          {},
  middleware:             [],

  inputs: {},

  run: function(api, data, next){
    data.response.billing = {
      rates: {
        includedMessagesPerMonth: api.config.billing.includedMessagesPerMonth,
        pricePerMessage:          api.config.billing.pricePerMessage,
        pricePerMonth:            api.config.billing.pricePerMonth,
      }
    };

    next();
  }
};
