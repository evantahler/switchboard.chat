exports.default = {
  twilio: function(api){
    return {
      "ssid"       : process.env.TWILIO_SSID,
      "token"      : process.env.TWILIO_TOKEN,
      "messageUrl" : process.env.PUBLIC_URL + '/api/message/in',
    };
  }
};

exports.test = {
  twilio: function(api){
    return {
      "ssid"       : 'AC576acd96f08a98c7011ea43320e3e5dc',
      "token"      : '0cf1fa2dd94d327994de757333a870e4',
      "messageUrl" : 'http://switchboard.test' + '/api/message/in',
    };
  }
};