# SMS and stuff

## Local development

- `brew install redis && redis-server start`
- `brew install mysql && mysql.server start`
- `mysql -e "create database switchboard_development"`
- `cp .env.example .env` and fill in your local config
- `source .env && npm start`

## TODO:

- billing
- when you sign up, we need some sort of "welcome" page
- complete the `about` page
- TESTS

## Production Vendors
- Hosted on Digital Ocean
  - evantahler@gmail.com
- instantssl.com
  - switchboard.chat / 2390ugwjialsGGgwg3
- sendgrid
  - switchboard.chat / admin@switchboard.chat / t0u2gwHIGOBWE
- mailchimp
  - mailchimp@switchboard.chat
  - q38tywghoeignowR~3
