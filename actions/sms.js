exports.smsIn = {
  name:                   'sms:in',
  description:            'sms:in',
  outputExample:          {},
  middleware:             [],

  inputs: {
    To:       { required: true }, // +14159658964
    From:     { required: true }, // +14128976361
    Body:     { required: true }, // ...
  },

  run: function(api, data, next){
    var from = api.twilio.sanitize(data.params.From);
    var to   = api.twilio.sanitize(data.params.To);

    var message = api.models.user.build({
      from:      from,
      to:        to,
      message:   data.params.Body,
      direction: 'in',
      read:      false,
    });

    message.save.then(function(){
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
  middleware:             [],

  inputs: {
    to:       { required: true }, // +14159658964
    body:     { 
      required: true, 
      validator: function(p){
        if(p.length > 150){ return false;  }
        return true;
      }
    },
  },

  run: function(api, data, next){
    var from = api.twilio.sanitize(api.config.twilio.number);
    var to   = api.twilio.sanitize(data.params.to);

    var message = api.models.user.build({
      from:      from,
      to:        to,
      message:   data.params.body,
      direction: 'in',
      read:      false,
    });

    message.save.then(function(){
      
      client.sendMessage({

          to: to,
          from: from,
          body: body,

      }, function(err,

    }).catch(function(errors){
      next(errors.errors[0].message);
    });
  }
};