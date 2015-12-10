var Twilio = require('twilio');

module.exports = {
  initialize: function(api, next){
    api.twilio = {
      client: Twilio(api.config.twilio.ssid, api.config.twilio.token),

      sanitize: function(number){
        return number.replace(/\D+/g, '');
      }
    };

    next();
  },

  start: function(api, next){
    api.sequelize.connect(next);
  }
};