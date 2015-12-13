var nodemailer    = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports = {
  initialize: function(api, next){
    var transporter = nodemailer.createTransport(smtpTransport(api.config.smtp));
    api.smtp = {
      client: transporter
    };

    next();
  },
};