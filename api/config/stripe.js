exports.default = {
  stripe: function (api) {
    return {
      SecretKey: process.env.STRIPE_API_SECRET_KEY,
      PublishableKey: process.env.STRIPE_API_PUBLISHABLE_KEY
    }
  }
}
