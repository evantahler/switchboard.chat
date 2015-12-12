exports.teamCreate = {
  name:                   'team:create',
  description:            'team:create',
  outputExample:          {},
  middleware:             [],

  inputs: {
    name:     { required: true },
    areaCode: { 
      required: true,
      formatter: function(p){ return parseInt(p); }
    },
  },

  run: function(api, data, next){
    var team = api.models.team.build(data.params);
    
    api.twilio.registerTeamPhoneNumber(team, function(error){
      team.save().then(
        api.models.team.findOne({where: {name: data.params.name}})
      ).then(function(teamObj){
        data.response.team = teamObj.apiData(api);
        next(error);
      }).catch(function(errors){
        next(errors.errors[0].message);
      });
    });    
  }
};

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
