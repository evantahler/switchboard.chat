var async = require('async');

exports.messageCommand = {
  name: '/team',
  matchers: [ 
    /^\/team/,
    /^\/Team/,
    /^\/TEAM/,
  ],
  description: 'Return information about your team',
  example: '/team',
  exampleResponse: 'Team Name: Switchboard Test Team\r\nYour most receent recieved message was @ Sat Dec 19 2015 15:22:17 (read)',

  run: function(api, message, team, person, callback){
    var jobs = [];

    jobs.push(function(done){
      var body = 'Team Name: ' + team.name;
      api.twilio.sendMessage(team, person, body, done);
    });

    jobs.push(function(done){
      var body;

      api.models.message.findAll({
        where: {teamId: team.id, direction: 'in'},
        order: 'createdAt desc',
        limit: 2,
      }).then(function(messages){
        if(messages.length < 2){ 
          body = 'You team has not recieved any messages'; 
        }else{
          body = 'Your most receent recieved message was @ ' + messages[1].createdAt + ' ' + (messages[1].read ? '(read)' : '(undread)');
        }
        api.twilio.sendMessage(team, person, body, done);
      }).catch(done);
    });

    async.series(jobs, callback);
  }
};
