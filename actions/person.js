exports.personCreate = {
  name:                   'person:create',
  description:            'person:create',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {
    phoneNumber:    { required: true },
    firstName:      { required: true },
    lastName:       { required: true },
    teamId:         { required: true },
    canUseCommands: { 
      required: false,
      default: function(){ return 0; }
    },
  },

  run: function(api, data, next){
    var person = api.models.person.build({
      phoneNumber: api.twilio.sanitize(data.params.phoneNumber),
      firstName: data.params.firstName,
      lastName: data.params.lastName,
      teamId: data.session.teamId,
      canUseCommands: data.params.canUseCommands,
    });

    person.save().then(function(){
      api.models.person.findOne({where: {
        phoneNumber: api.twilio.sanitize(data.params.phoneNumber), 
        teamId: data.session.teamId}
      }).then(function(pesronObj){
        data.response.person = pesronObj.apiData(api);
        next();
      }).catch(next);
    }).catch(function(errors){
      next(errors.errors[0].message);
    });
  }
};

exports.personView = {
  name:                   'person:view',
  description:            'person:view',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {
    personId: {
      required: true,
      formatter: function(p){ return parseInt(p); }
    }
  },

  run: function(api, data, next){
    api.models.person.findOne({where: {id: data.params.personId, teamId: data.session.teamId}}).then(function(person){
      if(!person){ return next(new Error('person not found')); }
      data.response.person = person.apiData(api);
      next();
    }).catch(next);
  }
};

exports.personList = {
  name:                   'person:list',
  description:            'person:list',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {},

  run: function(api, data, next){
    api.models.person.findAll({where: {teamId: data.session.teamId}, order: 'lastName asc'}).then(function(people){
      data.response.people = [];
      people.forEach(function(person){
        data.response.people.push( person.apiData(api) );
      });
      next();
    }).catch(next);
  }
};

exports.personUnreadCount = {
  name:                   'person:unreadCount',
  description:            'person:unreadCount',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {
    personId: {
      required: true,
      formatter: function(p){ return parseInt(p); }
    },
  },

  run: function(api, data, next){
    api.models.person.findOne({where: {
      id: data.params.personId,
      teamId: data.session.teamId,
    }}).then(function(person){
      if(!person){ return next(new Error('person not found')); }
      api.models.message.count({where: {
        $or: [
          {to: person.phoneNumber},
          {from: person.phoneNumber}
        ],
        teamId: data.session.teamId,
        read: false,
      }}).then(function(unreadCount){
        data.response.person = person.apiData(api);
        data.response.unreadCount = unreadCount;
        next();
      }).catch(next);
    }).catch(next);
  }
};

exports.personEdit = {
  name:                   'person:edit',
  description:            'person:edit',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {
    personId: {
      required: true,
      formatter: function(p){ return parseInt(p); }
    },
    phoneNumber:    { required: false },
    firstName:      { required: false },
    lastName:       { required: false },
    canUseCommands: { required: false },
  },

  run: function(api, data, next){
    api.models.person.findOne({where: {
      id: data.params.personId, 
      teamId: data.session.teamId}
    }).then(function(person){
      if(!person){ return next(new Error('person not found')); }
      
      person.updateAttributes({
        phoneNumber: api.twilio.sanitize(data.params.phoneNumber),
        firstName: data.params.firstName,
        lastName: data.params.lastName,
        canUseCommands: data.params.canUseCommands,
        teamId: data.session.teamId,
      }).then(function(){
        data.response.person = person.apiData(api);
        next();
      }).catch(next);
    }).catch(next);
  }
};

exports.personDelete = {
  name:                   'person:delete',
  description:            'person:delete',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {
    personId: {
      required: true,
      formatter: function(p){ return parseInt(p); }
    }
  },

  run: function(api, data, next){
    api.models.person.findOne({where: {id: data.params.personId, teamId: data.session.teamId}}).then(function(person){
      if(!person){ return next(new Error('person not found')); }
      person.destroy().then(function(){ next(); }).catch(next);
    }).catch(next);
  }
};
