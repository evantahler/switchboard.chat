const { api, Initializer } = require('actionhero')
const mustache = require('mustache')
const fs = require('fs')
const path = require('path')
const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')

module.exports = class MyInitializer extends Initializer {
  constructor () {
    super()
    this.name = 'email'
    this.loadPriority = 1000
    this.startPriority = 1000
    this.stopPriority = 1000
  }

  async initialize () {
    const transporter = nodemailer.createTransport(sendGridTransport({
      auth: { api_key: api.config.email.key }
    }))

    const emailTemplate = fs.readFileSync(path.resolve(__dirname, '..', 'public', 'email', 'template.html')).toString()

    api.email = {
      client: transporter,
      from: api.config.email.from,
      template: emailTemplate,
      subjectPrefix: api.config.email.subjectPrefix,
      send: async (to, subject, data, callback) => {
        subject = [api.email.subjectPrefix, subject].join(' ')
        data.publicUrl = process.env.PUBLIC_URL
        data.__copyrightYear = (new Date()).getFullYear()
        const html = mustache.render(api.email.template, data)

        const email = {
          from: api.email.from,
          to,
          subject,
          html
        }

        return new Promise((resolve, reject) => {
          api.email.client.sendMail(email, (error, response) => {
            if (error) { return reject(error) }
            return resolve(response)
          })
        })
      }
    }
  }
}
