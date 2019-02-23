exports.default = {
  email: function (api) {
    return {
      key: process.env.SENDGRID_KEY,
      from: process.env.EMAIL_FROM,
      subjectPrefix: '[Switchboard]'
    }
  }
}
