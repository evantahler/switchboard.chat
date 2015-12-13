var toBoolean = function(p){
  if(p === true || p === 1 || p === '1' || p === 'true'){
    return true;
  }
  else if(p === false || p === 0 || p === '0' || p === 'false'){
    return false;
  }
  else{
    throw new Error('cannot parse boolean option');
  }
};

exports.notificationView = {
  name:                   'notification:view',
  description:            'notification:view',
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
      api.models.notification.findOne({where: {userId: data.params.userId}}).then(function(notification){
        data.response.notification = notification.apiData(api);
        next();
      }).catch(next);
    }).catch(next);
  }
};

exports.notificationEdit = {
  name:                   'notification:edit',
  description:            'notification:edit',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {
    userId: {
      required: true,
      formatter: function(p){ return parseInt(p); }
    },
    notifyByEmail: {
      required: false,
      formatter: function(p){ return toBoolean(p); }
    },
    notifyBySMS: {
      required: false,
      formatter: function(p){ return toBoolean(p); }
    },
    notificationDelayMinutesSMS: {
      required: false,
      formatter: function(p){ return parseInt(p); }
    },
    notificationDelayMinutesEmail: {
      required: false,
      formatter: function(p){ return parseInt(p); }
    },
  },

  run: function(api, data, next){
    api.models.user.findOne({where: {id: data.params.userId, teamId: data.session.teamId}}).then(function(user){
      if(!user){ return next(new Error('user not found')); }
      api.models.notification.findOne({where: {userId: data.params.userId}}).then(function(notification){
        notification.updateAttributes(data.params).then(function(){
          data.response.notification = notification.apiData(api);
          next();
        }).catch(next);
      }).catch(next);
    }).catch(next);
  }
};
