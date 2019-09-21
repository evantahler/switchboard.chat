# Switchboard.chat

*visit www.actionherojs.com for more information*

## To install:
(assuming you have [node](http://nodejs.org/) and NPM installed) - `yarn install` and `cd mobile && yarn install`.  We use Yarn workspaces to manage the monorepo's dependencies.

Set up your environment variables.  First, `cp .env.example .env` and fill them in

## Installing Mysql 5 on OSX:
* `brew install mysql@5.7`
* `brew install mysql-client`
* `echo 'export PATH="/usr/local/opt/mysql-client/bin:$PATH"' >> ~/.bash_profile` + `source ~/.bash_profile`

Then, create the database
* `mysql -u root -e "create database switchboard_development"`

## To Run:
`heroku local` - will start both the next frontend server and the api backend server from Procfile

## To Test:
`./api/bin/create-test-databases`
`yarn test`

## Mobile Setup
We do not automatically deploy the mobile app

```
brew cask install fastlane
```

* Ensure that the app is part of the team "Delicious Hat LLC"
