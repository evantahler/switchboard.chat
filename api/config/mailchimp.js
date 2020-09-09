exports.default = {
  mailchimp: function (api) {
    return {
      apiKey: process.env.MAILCHIMNP_API_KEY,
      listId: process.env.MAILCHIMP_LIST_ID
    }
  }
}
