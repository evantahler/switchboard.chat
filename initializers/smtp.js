var nodemailer    = require('nodemailer');
var sendGridTransport = require('nodemailer-sendgrid-transport');

module.exports = {
  initialize: function(api, next){
    var transporter = nodemailer.createTransport(sendGridTransport({
      auth: { api_key: process.env.SENDGRID_KEY }
    }));

    api.smtp = {
      client: transporter
    };

    next();
  },
};