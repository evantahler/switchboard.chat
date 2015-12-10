exports.default = {
  twilio: function(api){
    return {
      "number" : process.env.TWILIO_PHONE_NUMBER,
      "ssid"   : process.env.TWILIO_SSID,
      "token"  : process.env.TWILIO_TOKEN,
    };
  }
};