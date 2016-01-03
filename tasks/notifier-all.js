var async = require('async');

exports.task = {
  name:          'notifier-all',
  description:   'notifier-all',
  frequency:     (1000 * 60),
  queue:         'default',
  plugins:       ['queueLock'],
  pluginOptions: { lock_timeout: 61 },

  run: function(api, params, next){
    api.models.team.findAll().then(function(teams){
      var jobs = [];
      teams.forEach(function(team){
        jobs.push(function(done){
          api.tasks.enqueue("notifier-team", {teamId: team.id}, 'default', done);
        });
      });

      async.parallel(jobs, function(error){ next(error); });
    }).catch(next);
  }
};
