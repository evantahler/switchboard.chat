exports.default = {
  twilio: function (api) {
    return {
      ssid: process.env.TWILIO_SSID,
      token: process.env.TWILIO_TOKEN,
      messageUrl: process.env.API_URL + '/api/twilio/in',
      voiceUrl: process.env.API_URL + '/api/twilio/voice',
      phoneNumberDefaultCountry: 'US'
    }
  }
}
