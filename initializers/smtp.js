var mustache          = require('mustache');
var fs                = require('fs');
var nodemailer        = require('nodemailer');
var sendGridTransport = require('nodemailer-sendgrid-transport');

module.exports = {
  initialize: function(api, next){
    var transporter = nodemailer.createTransport(sendGridTransport({
      auth: { api_key: api.config.smtp.key }
    }));

    api.smtp = {
      client: transporter,
      from: api.config.smtp.from,
      template: fs.readFileSync(__dirname + '/../public/email/email.html'),
    };

    api.smtp.send = function(to, subject, data, callback){
      subject = '[switchboard.chat] ' + subject;
      data.publicUrl = process.env.PUBLIC_URL;
      var html = mustache.render(api.smtp.template.toString(), data);

      var email = {
        from:    api.smtp.from,
        to:      to,
        subject: subject,
        html:    html,
      };

      api.smtp.client.sendMail(email, callback);
    };

    next();
  },
};