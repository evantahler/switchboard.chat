exports.default = {
  smtp: function(api){
    return {
      key: process.env.SENDGRID_KEY,
      from: process.env.SMTP_FROM,
    };
  }
};

exports.test = {
  smtp: function(api){
    return {};
  }
};