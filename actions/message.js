exports.messageIn = {
  name:                   'message:in',
  description:            'message:in',
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

    api.models.team.findOne({where: {phoneNumber: to}}).then(function(team){
      if(!team){ return next(new Error('team not found')); }

      var message = api.models.message.build({
        from:      from,
        to:        to,
        message:   data.params.Body,
        direction: 'in',
        teamId:    team.id,
        read:      false,
      });

      message.save().then(function(){
        api.chatRoom.broadcast({}, 'team:' + team.id, message.apiData(api) );
        next();
      }).catch(function(errors){
        next(errors.errors[0].message);
      });
    }).catch(next);
  }
};

exports.messageOut = {
  name:                   'message:out',
  description:            'message:out',
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
    api.models.team.findOne({where: {id: data.session.teamId}}).then(function(team){
      if(!team){ return next(new Error('team not found')); }

      var from = api.twilio.sanitize(team.phoneNumber);
      var to   = api.twilio.sanitize(data.params.to);

      var message = api.models.message.build({
        from:      from,
        to:        to,
        message:   data.params.body,
        direction: 'out',
        read:      true,
        teamId:    team.id,
      });

      message.save().then(function(){
        var payload = {
          to: to,
          from: from,
          body: data.params.body,
        };

        api.twilio.client.sendMessage(payload, function(error){
          if(error){ api.log(error, 'error'); }
          else{ api.chatRoom.broadcast({}, 'team:' + team.id, message.apiData(api) ); }
          next(error);
        });

      }).catch(next);
    });
  }
};

exports.messageList = {
  name:                   'message:list',
  description:            'message:list',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {
    limit:       { 
      required: true,
      default: 100,
      formatter: function(p){ return parseInt(p); }
    },
    offset:      { 
      required: true,
      default: 0,
      formatter: function(p){ return parseInt(p); }
    },
    personId:    { 
      required: false,
      formatter: function(p){ return parseInt(p); }
    },
  },

  run: function(api, data, next){
    var q;

    var findMessages = function(){
      api.models.message.findAll(q).then(function(records){
        var d = [];
        records.forEach(function(r){
          if(r.read !== true){ r.updateAttributes({read: true}); }
          d.push(r.apiData(api));
        });
        data.response.messages = d;
        next();
      }).catch(next);
    };

    if(data.params.personId){

      api.models.person.findOne({where: { id: data.params.personId, teamId: data.session.teamId }}).then(function(person){
        q = {
          where: { 
            teamId: data.session.teamId,
            $or: [{to: api.twilio.sanitize(person.phoneNumber)}, {from: api.twilio.sanitize(person.phoneNumber)}]
          },
          limit: data.params.limit, 
          offset: data.params.offset,
          order: 'createdAt desc',
        };

        findMessages();
      }).catch(error);

    }else{
      
      q = {
        where: { teamId: data.session.teamId },
        limit: data.params.limit, 
        offset: data.params.offset,
        order: 'createdAt desc',
      };

      findMessages();
    }
  }
};
