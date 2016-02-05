# SMS and stuff

## Local development

- `brew install redis && redis-server start`
- `brew install mysql && mysql.server start`
- `mysql -e "create database switchboard_development"`
- `cp .env.example .env` and fill in your local config
- `source .env && npm start`

## TODO:
- Monit cannot start actionhero, deploys can... something about ENV?
- email notifications should use person's name
- host the static site on S3?
- OPS stuff
- TESTS

## Production Vendors
- Hosted on Digital Ocean
  - evantahler@gmail.com
- instantssl.com
  - switchboard.chat / 2390ugwjialsGGgwg3
- twilio:
  - admin@switchboard.chat / 4usjWkPhurjgQsgeKahaW7Kic
- sendgrid
  - switchboard.chat / admin@switchboard.chat / t0u2gwHIGOBWE
- mailchimp
  - mailchimp@switchboard.chat
  - q38tywghoeignowR~3
- stripe
  - admin@switchboard.chat / 2tugwihBR0935EAIJ~!@FGRWdf
- uptimerobot.com
  - admin@switchboard.chat | 3tguwhioJNK$EFH5

## HTTPS moved to letsEncrypt!
- Use the helper website -> https://gethttpsforfree.com
