exports.default = {
  'ah-resque-ui': (api) => {
    return {
      middleware: ['resque-ui-auth-middleware'],
      password: process.env.RESQUE_UI_PASSWORD
    }
  }
}
