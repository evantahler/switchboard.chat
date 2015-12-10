var Twilio = require('twilio');

module.exports = {
  initialize: function(api, next){
    api.twilio = {
      client: Twilio(api.config.twilio.ssid, api.config.twilio.token),

      sanitize: function(number){
        number = number.replace(/\D+/g, '');
        if (number.length === 10){ number = '1' + number; }
        return number;
      }
    };

    next();
  },

  start: function(api, next){
    api.sequelize.connect(next);
  }
};