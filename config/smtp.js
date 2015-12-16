exports.default = {
  smtp: function(api){
    return {
      port: process.env.SMTP_PORT || 25,
      secure: (process.env.SMTP_SECURE === 'true'),
      host: process.env.SMTP_HOST,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    };
  }
};

exports.test = {
  smtp: function(api){
    return {};
  }
};