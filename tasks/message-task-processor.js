exports.task = {
  name:          'message-task-processor',
  description:   'message-task-processor',
  frequency:     0,
  queue:         'default',
  plugins:       [],
  pluginOptions: {},

  run: function(api, params, next){
    api.messageCommands.runAll(params.messageId, next);
  }
};
