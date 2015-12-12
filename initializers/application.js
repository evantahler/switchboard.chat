var async = require('async');

module.exports = {
  startPriority: 9999,

  initialize: function(api, next){

    var chatMiddleware = {
      name: 'chat middleware',
      priority: 1000,
      join: function(connection, room, callback){
        var roomParts = room.split(':');
        var roomNameId = parseInt(roomParts[1]);

        if(connection.session.teamId !== roomNameId){
          callback('cannot join this team room');
        }else{
          callback();
        }
      }
    };

    api.chatRoom.addMiddleware(chatMiddleware);

    next();
  },

  start: function(api, next){
    var jobs = [];

    // ensure that the first team exists
    jobs.push(function(done){
      api.models.team.count().then(function(count){
        if(count > 0){
          done(); 
        }else{
          var team = api.models.team.build({
            name:     'first team',
            areaCode: 412,
            phoneNumber: null,
          });

          api.twilio.registerTeamPhoneNumber(team, function(error){
            api.log('*** created first team with number ' + team.phoneNumber + ' ***', 'alert');
            done();
          });
        }
      }).catch(done);
    });

    // ensure that the first admin user exists
    jobs.push(function(done){
      api.models.user.count().then(function(count){
        if(count > 0){
          done(); 
        }else{
          var user = api.models.user.build({
            email:     'admin@localhost.com',
            teamId:    1,
            firstName: 'admin',
            lastName:  'admin',
          });

          user.updatePassword('password', function(error){
            if(error){ return next(error); }
            user.save().then(function(){
              api.log('*** created first admin user `admin@localhost.com` with password `password` ***', 'alert');
              done();
            }).catch(done);
          });
        }
      }).catch(done);
    });

    // create chat rooms for all existing teams
    jobs.push(function(done){
      api.models.team.findAll().then(function(teams){
        teams.forEach(function(team){
          var roomName = 'team:' + team.id;
          api.chatRoom.add(roomName);
        });

        done();
      }).catch(done);
    });

   async.series(jobs, next);
  }
};