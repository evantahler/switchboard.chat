var async = require('async');

exports.messageCommand = {
  name: '/all',
  matchers: [ 
    /^\/all\s+.*$/,
    /^\/All\s+.*$/,
    /^\/ALL\s+.*$/,
  ],
  description: 'Send a message to all people in this team\'s address book',
  example: '/all the power in the office is out... don\'t come in!',
  exampleResponse: 'Your message has been forwarded to 15 team members and 4 team administrators',

  run: function(api, message, team, person, callback){
    var jobs = [];
    var uniqueNumbers = [];
    var peopleCount   = 0;
    var usersCount    = 0;

    var body = message.message;
    body = body.replace('/all ', '');
    body = body.replace('/All ', '');
    body = body.replace('/ALL ', '');
    body = '[' + person.firstName + ' ' + person.lastName + '] ' + body;

    uniqueNumbers.push(person.phoneNumber);

    api.models.person.findAll({where: {
      teamId: team.id
    }}).then(function(people){

      people.forEach(function(p){
        if(uniqueNumbers.indexOf(p.phoneNumber) < 0){
          uniqueNumbers.push(p.phoneNumber);
          peopleCount++;
          jobs.push(function(done){ api.twilio.sendMessage(team, p, body, done); });
        }
      });

      api.models.user.findAll({where: {
        teamId: team.id
      }}).then(function(users){

        users.forEach(function(u){
          if(uniqueNumbers.indexOf(u.phoneNumber) < 0){
            uniqueNumbers.push(u.phoneNumber);
            usersCount++;
            jobs.push(function(done){ api.twilio.sendMessage(team, u, body, done); });
          }
        });

        jobs.push(function(done){
          var body = 'Your message has been forwarded to ' + peopleCount + ' team member(s) and ' + usersCount + ' team administrator(s)';
          api.twilio.sendMessage(team, person, body, done);
        });

        async.series(jobs, callback);
      }).catch(callback);
    }).catch(callback);
  }
};
