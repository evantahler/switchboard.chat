var nodemailer    = require('nodemailer');
var sendGridTransport = require('nodemailer-sendgrid-transport');

module.exports = {
  initialize: function(api, next){
    var transporter = nodemailer.createTransport(sendGridTransport({
      auth: { api_key: api.config.smtp.key }
    }));

    api.smtp = {
      client: transporter,
      from: api.config.smtp.from,
    };

    api.smtp.send = function(to, subject, html, callback){
      var email = {
        from:    api.smtp.from,
        to:      to,
        subject: subject,
        html:    html
      };
      
      api.smtp.client.sendMail(email, callback);
    };

    next();
  },
};