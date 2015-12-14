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

        if(!connection.session || connection.session.teamId !== roomNameId){
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