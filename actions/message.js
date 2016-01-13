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
        api.twilio.decorateMessage(team, message, function(error, formattedMessage){
          if(error){ return next(error); }

          api.chatRoom.broadcast({}, 'team:' + team.id, formattedMessage );
          api.tasks.enqueue('message-task-processor', {messageId: message.id, teamId: team.id}, 'default');

          // Twilio wants XML
          data.connection.rawConnection.responseHeaders.push(['Content-Type', 'application/xml']);
          data.response = '<Response></Response>';

          next();
        });
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
    personId: { required: true },
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
      api.models.person.findOne({where: {
        id: data.params.personId,
        teamId: data.session.teamId,
      }}).then(function(person){
        if(!person){ return next(new Error('person not found')); }
        api.twilio.sendMessage(team, person, data.params.body, next);
      }).catch(next);
    }).catch(next);
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
    personIds: {
      required: false,
      formatter: function(p){
        var strings = p.split(',');
        var numbers = [];
        strings.forEach(function(s){
          numbers.push( parseInt(s) );
        });
        return numbers;
      }
    },
  },

  run: function(api, data, next){
    var q;
    var people;

    var findMessages = function(){
      api.models.team.findOne({id: data.session.teamId}).then(function(team){
        if(!team){ return next('team not found'); }

        api.models.message.findAll(q).then(function(records){
          var formatedRecords = [];

          records.forEach(function(r){
            if(r.read !== true){ r.updateAttributes({read: true}); }
            var d = r.apiData(api);
            if(people){
              people.forEach(function(person){
                if(d.to   === person.phoneNumber){ d.toString = person.firstName + ' ' + person.lastName; }
                if(d.from === person.phoneNumber){ d.fromString = person.firstName + ' ' + person.lastName; }
              });
            }
            if(d.to   === team.phoneNumber){ d.toString = team.name; }
            if(d.from === team.phoneNumber){ d.fromString = team.name; }

            formatedRecords.push(d);
          });

          data.response.messages = formatedRecords;
          data.response.offset = data.params.offset;
          data.response.limit = data.params.limit;
          api.models.message.count({where: q.where}).then(function(total){
            data.response.total = total;
            next();
          }).catch(next);
        }).catch(next);
      }).catch(next);
    };

    if(data.params.personIds){
      // TODO: This will probably get really slow

      api.models.person.findAll({
        where: { id: data.params.personIds, teamId: data.session.teamId }
      }).then(function(_people){
        people = _people;
        var numbers = [];

        people.forEach(function(person){
          numbers.push({to: api.twilio.sanitize(person.phoneNumber)});
          numbers.push({from: api.twilio.sanitize(person.phoneNumber)});
        });

        q = {
          where: {
            teamId: data.session.teamId,
            $or: numbers
          },
          limit: data.params.limit,
          offset: data.params.offset,
          order: 'createdAt desc',
        };

        findMessages();
      }).catch(next);

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

exports.messageRead = {
  name:                   'message:read',
  description:            'message:read',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {
    messageId:       {
      required: true,
      formatter: function(p){ return parseInt(p); }
    }
  },

  run: function(api, data, next){
    api.models.message.findOne({where: {teamId: data.session.teamId, id: data.params.messageId}}).then(function(message){
      message.updateAttributes({read: true}).then(function(){
        next();
      }).catch(next);
    }).catch(next);
  },
};
