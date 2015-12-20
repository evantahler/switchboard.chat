var async = require('async');
var glob  = require('glob');

module.exports = {
  initialize: function(api, next){
    api.messageCommands = {

      commands: {},

      runAll: function(messageId, callback){
        var jobs = [];
        var toRun = false;
        var person, message, team;

        jobs.push(function(done){
          api.models.message.findById(messageId).then(function(_message){
            if(!_message){ return done(new Error('message not found')); }
            message = _message;
            done();
          }).catch(done);
        });

        jobs.push(function(done){
          api.models.team.findById(message.teamId).then(function(_team){
            if(!_team){ return done(new Error('team not found')); }
            team = _team;
            done();
          }).catch(done);
        });

        jobs.push(function(done){
          api.models.person.findOne({where: {
            teamId: team.id,
            phoneNumber: message.from
          }}).then(function(_person){
            if(!_person){
              return done(); // this message is not from a registered person
            }else if(_person.canUseCommands !== true){
              var body = 'You are not authorized to run commands.  Contact a team administrator';
              api.twilio.sendMessage(team, _person, body, done);
            }else{
              person = _person;
              toRun = true;
              done();
            }
          }).catch(done);
        });

        async.series(jobs, function(error){
          if(error){ return callback(error); }
          if(!toRun){ return callback(); }

          var enqueueCommandCheck = function(command){
            commandJobs.push(function(done){
              api.messageCommands.runIfMatched(command, message, team, person, done);
            });
          };
          
          var commandJobs = [];
          for(var commandName in api.messageCommands.commands){
            var command = api.messageCommands.commands[commandName];
            enqueueCommandCheck(command);
          }

          async.series(commandJobs, callback);
        });
      },

      runIfMatched: function(command, message, team, person, callback){
        var matched = false;

        command.matchers.forEach(function(regexp){
          if(message.message.match(regexp)){ matched = true; }
        });

        if(matched){ 
          api.log('[message command] running `' + command.name + '` for message #' + message.id);
          return command.run(api, message, team, person, callback); 
        }else{ 
          return callback(); 
        }
      },
    };

    glob.sync(__dirname  + '/../messageCommands/*.js').forEach(function(file){
      var command = require(file).messageCommand;
      api.messageCommands.commands[command.name] = command;
    });

    next();
  }
};
