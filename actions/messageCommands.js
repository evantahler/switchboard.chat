exports.personList = {
  name:                   'messageCommand:list',
  description:            'messageCommand:list',
  outputExample:          {},
  middleware:             [],

  inputs: {},

  run: function(api, data, next){
    data.response.messageCommands = api.messageCommands.commands;
    next();
  }
};