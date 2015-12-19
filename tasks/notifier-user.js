var async = require('async');

exports.task = {
  name:          'notifier-user',
  description:   'notifier-user',
  frequency:     0,
  queue:         'default',
  plugins:       ['queueLock'],
  pluginOptions: { lock_timeout: 61 },

  run: function(api, params, next){
    api.models.user.findOne({where: {id: params.userId}}).then(function(user){
      api.models.team.findOne({where: {id: user.teamId}}).then(function(team){
        api.notifier.notifyUser(user, team, next);
      }).catch(next);
    }).catch(next);
  }
};
