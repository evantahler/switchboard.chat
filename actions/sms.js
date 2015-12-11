exports.smsIn = {
  name:                   'sms:in',
  description:            'sms:in',
  outputExample:          {},
  middleware:             [],

  inputs: {
    To:         { required: true }, // +14159658964
    From:       { required: true }, // +14128976361
    AccountSid: { required: true }, // +14128976361
    Body:       { required: true }, // ...
  },

  run: function(api, data, next){
    if(data.params.AccountSid !== api.config.twilio.ssid){
      return next(new Error('SSID does not match'));
    }

    var from = api.twilio.sanitize(data.params.From);
    var to   = api.twilio.sanitize(data.params.To);

    var message = api.models.message.build({
      from:      from,
      to:        to,
      message:   data.params.Body,
      direction: 'in',
      read:      false,
    });

    message.save().then(function(){
      next();
    }).catch(function(errors){
      next(errors.errors[0].message);
    });
  }
};

exports.smsOut = {
  name:                   'sms:out',
  description:            'sms:out',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {
    to:       { required: true }, // +14159658964
    body:     { 
      required: true, 
      validator: function(p){
        if(p.length > 150){ return 'message too long'; }
        return true;
      }
    },
  },

  run: function(api, data, next){
    var from = api.twilio.sanitize(api.config.twilio.number);
    var to   = api.twilio.sanitize(data.params.to);

    var message = api.models.message.build({
      from:      from,
      to:        to,
      message:   data.params.body,
      direction: 'out',
      read:      false,
    });

    message.save().then(function(){
      var payload = {
        to: to,
        from: from,
        body: data.params.body,
      };

      api.twilio.client.sendMessage(payload, function(error){
        if(error){ api.log(error, 'error'); }
        next(error);
      });

    }).catch(function(errors){
      next(errors.errors[0].message);
    });
  }
};

exports.smsList = {
  name:                   'sms:list',
  description:            'sms:list',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {
    limit:       { 
      required: true,
      default: 100,
      formatter: function(p){ return parseInt(p); }
    },
    offset:       { 
      required: true,
      default: 0,
      formatter: function(p){ return parseInt(p); }
    },
  },

  run: function(api, data, next){
    api.models.message.findAll({
      limit: data.params.limit, 
      offset: data.params.offset,
      order: 'createdAt desc',
    }).then(function(records){
      var d = [];
      records.forEach(function(r){
        d.push(r.apiData(api));
      });

      data.response.messages = d;
      next();
    }).catch(function(errors){
      next(errors.errors[0].message);
    });
  }
};
