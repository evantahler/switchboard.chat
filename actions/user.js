exports.userCreate = {
  name:                   'user:create',
  description:            'user:create',
  outputExample:          {},
  middleware:             [],

  inputs: {
    email:       { required: true },
    password:    { required: true },
    firstName:   { required: true },
    lastName:    { required: true },
    teamId:      { required: true },
  },

  run: function(api, data, next){
    var user = api.models.user.build(data.params);
    user.updatePassword(data.params.password, function(error){
      if(error){ return next(error); }

      user.save().then(
        api.models.user.findOne({where: {email: data.params.email}})
      ).then(function(userObj){
        data.response.user = userObj.apiData(api);
        next(error);
      })
      .catch(function(errors){
        next(errors.errors[0].message);
      });
    });
  }
};

exports.userView = {
  name:                   'user:view',
  description:            'user:view',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {
    userId: {
      required: true,
      formatter: function(p){ return parseInt(p); }
    }
  },

  run: function(api, data, next){
    api.models.user.findOne({where: {id: data.params.userId, teamId: data.session.teamId}}).then(function(user){
      if(!user){ return next(new Error('user not found')); }
      data.response.user = user.apiData(api);
      next();
    })
    .catch(next)
    ;
  }
};

exports.userEdit = {
  name:                   'user:edit',
  description:            'user:edit',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {
    userId: {
      required: true,
      formatter: function(p){ return parseInt(p); }
    },
    email:       { required: false },
    password:    { required: false },
    firstName:   { required: false },
    lastName:    { required: false },
  },

  run: function(api, data, next){
    api.models.user.findOne({where: {id: data.params.userId, teamId: data.session.teamId}}).then(function(user){
      if(!user){ return next(new Error('user not found')); }
      user.updateAttributes(data.params).then(function(){
        data.response.user = user.apiData(api);
        if(data.params.password){
          user.updatePassword(data.params.password, function(error){
            if(error){ return next(error); }
            user.save().then(function(){
              next();
            }).catch(next);
          });
        }else{
          next();
        }
      }).catch(next);
    })
    .catch(next)
    ;
  }
};

exports.userDelete = {
  name:                   'user:delete',
  description:            'user:delete',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {
    userId: {
      required: true,
      formatter: function(p){ return parseInt(p); }
    }
  },

  run: function(api, data, next){
    if(data.session.userId === data.params.userId){
      return next(new Error('you cannot delete yourself'));
    }

    api.models.user.findOne({where: {id: data.params.userId, teamId: data.session.teamId}}).then(function(user){
      if(!user){ return next(new Error('user not found')); }
      user.destroy().then(function(){ next(); }).catch(next);
    })
    .catch(next)
    ;
  }
};
