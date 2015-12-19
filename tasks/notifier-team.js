var async = require('async');

exports.task = {
  name:          'notifier-team',
  description:   'notifier-team',
  frequency:     0,
  queue:         'default',
  plugins:       ['queueLock'],
  pluginOptions: { lock_timeout: 61 },

  run: function(api, params, next){
   api.models.message.findAll({
     where: {teamId: params.teamId, read: false},
     limit: 1,
   }).then(function(messages){
     api.log('checking team #' + params.teamId + ' for unseen messages');
     if(messages.length === 0){ return next(); }

     api.models.user.findAll({where: {teamId: params.teamId}}).then(function(users){
       var jobs = [];
       users.forEach(function(user){
         jobs.push(function(done){
          api.tasks.enqueue("notifier-user", {
            userId:    user.id,
          }, 'default', done);
         });
       });

       async.parallel(jobs, next);
     }).catch(next);
   }).catch(next);
  }
};
