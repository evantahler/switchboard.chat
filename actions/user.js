exports.userCreate = {
  name:                   'user:create',
  description:            'user:create',
  outputExample:          {},
  middleware:             [],

  inputs: {
    email:       { required: true },
    password:    { required: false },
    firstName:   { required: true },
    lastName:    { required: true },
    role:        { required: false },
    phoneNumber: { required: false },
  },

  run: function(api, data, next){
    var user = api.models.user.build(data.params);
    if(data.params.phoneNumber){ data.params.phoneNumber = api.twilio.sanitize(data.params.phoneNumber); }

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
      required: false,
      formatter: function(p){ return parseInt(p); }
    }
  },

  run: function(api, data, next){
    var userId = data.session.userId;
    if(data.params.userId){ userId = userId; }

    api.models.user.findOne({where: {id: userId}}).then(function(user){
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
      required: false,
      formatter: function(p){ return parseInt(p); }
    },

    email:       { required: false },
    password:    { required: false },
    firstName:   { required: false },
    lastName:    { required: false },
    role:        { required: false },
    phoneNumber: { required: false },
  },

  run: function(api, data, next){
    var userId = data.session.userId;
    if(data.params.userId){ userId = userId; }

    if(data.params.phoneNumber){ data.params.phoneNumber = api.twilio.sanitize(data.params.phoneNumber); }

    api.models.user.findOne({where: {id: userId}}).then(function(user){
      if(!user){ return next(new Error('user not found')); }
      user.updateAttributes(data.params).then(function(){
        data.response.user = user.apiData(api);
        if(data.params.password){
          user.updatePassword(data.params.password, function(error){
            if(error){ return callback(error); }
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
    // TODO: don't delete yourself

    api.models.user.findOne({where: {id: data.params.userId}}).then(function(user){
      if(!user){ return next(new Error('user not found')); }
      user.destroy().then(function(){ next(); }).catch(next);
    })
    .catch(next)
    ;
  }
};
