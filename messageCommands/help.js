var async = require('async');

exports.messageCommand = {
  name: '/help',
  matchers: [ 
    /^\/help/,
    /^\/Help/,
    /^\/HELP/,
  ],
  description: 'The system will responsd with help about how to use these commands',
  example: '/help',
  exampleResponse: 'The commands you can run are:\r\n/all: Send a message to all people in this team\'s address book\r\n/help: The system will responsd with help about how to use these commands\r\n/team: Return information about your team',

  run: function(api, message, team, person, callback){
    if(!person){ return callback(); }

    var jobs = [];

    jobs.push(function(done){
      var body = 'The commands you can run are:';
      api.twilio.sendMessage(team, person, body, done);
    });

    var prepareMessage = function(command){
      jobs.push(function(done){
        var body = command.name + ': ' + command.description;
        api.twilio.sendMessage(team, person, body, done);
      });
    };

    for(var commandName in api.messageCommands.commands){
      var command = api.messageCommands.commands[commandName];
      prepareMessage(command);
    }

    async.series(jobs, callback);
  }
};
