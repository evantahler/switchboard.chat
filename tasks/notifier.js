exports.task = {
  name:          'notifier',
  description:   'notifier',
  frequency:     (1000 * 60),
  queue:         'default',
  plugins:       [],
  pluginOptions: {},

  run: function(api, params, next){
    api.notifier.workAll(next);
  }
};
