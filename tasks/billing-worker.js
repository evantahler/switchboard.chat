var async = require('async');

exports.task = {
  name:          'billing-worker',
  description:   'billing-worker',
  frequency:     (1000 * 60 * 60 * 6),
  queue:         'default',
  plugins:       ['queueLock'],
  pluginOptions: { lock_timeout: (1000 * 60 * 61 * 12) },

  run: function(api, params, next){
    var jobs = [];

    var lastMonth = new Date();
    lastMonth.setDate(1);
    lastMonth.setMonth( lastMonth.getMonth() - 1 );

    api.models.team.findAll().then(function(teams){
      teams.forEach(function(team){
        if(lastMonth >= team.createdAt){
          jobs.push(function(done){
            api.billing.createMonthlyBillCharge(lastMonth, team, done);
          });

          jobs.push(function(done){
            api.billing.createExtraMessagesCharge(lastMonth, team, done);
          });
        }
      });

      async.series(jobs, function(error){ next(error); });
    }).catch(next);
  }
};
