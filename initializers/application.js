var async = require('async');

module.exports = {
  startPriority: 9999,

  initialize: function(api, next){
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

   async.series(jobs, next);
  }
};