var async = require('async')

exports.teamCreate = {
  name:                   'team:comboCreate',
  description:            'team:comboCreate',
  outputExample:          {},
  middleware:             [],

  inputs: {
    // user stuff
    email:       { required: true },
    password:    { required: true },
    firstName:   { required: true },
    lastName:    { required: true },

    // team stuff
    name:     { required: true },
    areaCode: { 
      required: true,
      formatter: function(p){ return parseInt(p); }
    },

    // billing stuff
    // TODO
  },

  run: function(api, data, next){
    var jobs = [];

    var team = api.models.team.build({
      name:     data.params.name,
      areaCode: data.params.areaCode,
    });

    var user = api.models.user.build({
      email:     data.params.email,
      firstName: data.params.firstName,
      lastName:  data.params.lastName,
    });

    jobs.push(function(done){
      // stub for billing... do this first
      done();
    });

    jobs.push(function(done){
      user.updatePassword(data.params.password, done);
    });

    jobs.push(function(done){
      team.save().then(function(){
        done();
      }).catch(done);
    });

    jobs.push(function(done){
      user.teamId = team.id;
      user.save().then(function(){
        done();
      }).catch(done);
    });

    jobs.push(function(done){
      var notification = api.models.notification.build({ userId: user.id });
      notification.save().then(function(){
        done();
      }).catch(done);
    });

    jobs.push(function(done){
      api.twilio.registerTeamPhoneNumber(team, function(error){
        if(error){ return done(error); }
        team.save().then(function(){
          done();
        }).catch(done);
      });
    });

    jobs.push(function(done){
      var roomName = 'team:' + team.id;
      api.chatRoom.add(roomName);
      done();
    });

    jobs.push(function(done){
      data.response.user = user.apiData(api);
      data.response.team = team.apiData(api);
      done();
    });

    async.series(jobs, function(error){
      if(error){
        // roll it back
        try{ user.destroy(); }catch(e){ api.log(e, 'error'); }
        try{ team.destroy(); }catch(e){ api.log(e, 'error'); }
        
        if(errors.errors){
          next(errors.errors[0].message);
        }else{
          next(error);
        }
      }else{
        next();
      }
    });
  }
};

// exports.teamCreate = {
//   name:                   'team:create',
//   description:            'team:create',
//   outputExample:          {},
//   middleware:             [],

//   inputs: {
//     name:     { required: true },
//     areaCode: { 
//       required: true,
//       formatter: function(p){ return parseInt(p); }
//     },
//   },

//   run: function(api, data, next){
//     var team = api.models.team.build(data.params);
    
//     api.twilio.registerTeamPhoneNumber(team, function(error){
//       team.save().then(
//         api.models.team.findOne({where: {name: data.params.name}})
//       ).then(function(teamObj){
//         data.response.team = teamObj.apiData(api);
//         next(error);
//       }).catch(function(errors){
//         next(errors.errors[0].message);
//       });
//     });    
//   }
// };

exports.teamView = {
  name:                   'team:view',
  description:            'team:view',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {},

  run: function(api, data, next){
    api.models.team.findOne({where: {id: data.session.teamId}}).then(function(team){
      if(!team){ return next(new Error('team not found')); }
      data.response.team = team.apiData(api);
      next();
    }).catch(next);
  }
};

exports.teamEdit = {
  name:                   'team:edit',
  description:            'team:edit',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {
    name: { required: false },
  },

  run: function(api, data, next){
    api.models.team.findOne({where: {id: data.session.teamId}}).then(function(team){
      if(!team){ return next(new Error('team not found')); }
      team.updateAttributes(data.params).then(function(){
        data.response.team = team.apiData(api);
        next();
      }).catch(next);
    }).catch(next);
  }
};

exports.teamDelete = {
  name:                   'team:delete',
  description:            'team:delete',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {},

  run: function(api, data, next){
    api.models.team.findOne({where: {id: data.session.teamId}}).then(function(team){
      if(!team){ return next(new Error('team not found')); }
      team.destroy().then(function(){
        api.models.users.findAll({where: {teamId: data.session.teamId}}).then(function(users){
          users.forEach(function(user){ user.destroy(); });
          next();
        }).catch(next);
      }).catch(next);
    }).catch(next);
  }
};
