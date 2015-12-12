exports.personCreate = {
  name:                   'person:create',
  description:            'person:create',
  outputExample:          {},
  middleware:             [],

  inputs: {
    phoneNumber: { required: true },
    firstName:   { required: true },
    lastName:    { required: true },
    teamId:      { required: true },
  },

  run: function(api, data, next){
    var person = api.models.person.build({
      phoneNumber: api.twilio.sanitize(data.params.phoneNumber),
      firstName: data.params.firstName,
      lastName: data.params.lastName,
      teamId: data.session.teamId,
    });

    person.save().then(
      api.models.person.findOne({where: {phoneNumber: data.params.phoneNumber, teamId: data.session.teamId}})
    ).then(function(pesronObj){
      data.response.person = pesronObj.apiData(api);
      next(error);
    })
    .catch(function(errors){
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
    })
    .catch(next)
    ;
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
    phoneNumber: { required: false },
    firstName:   { required: false },
    lastName:    { required: false },
  },

  run: function(api, data, next){
    api.models.person.findOne({where: {id: data.params.personId, teamId: data.session.teamId}}).then(function(person){
      if(!person){ return next(new Error('person not found')); }
      person.updateAttributes({
        phoneNumber: api.twilio.sanitize(data.params.phoneNumber),
        firstName: data.params.firstName,
        lastName: data.params.lastName,
        teamId: data.session.teamId,
      }).then(function(){
        data.response.person = person.apiData(api);
        next();
      }).catch(next);
    })
    .catch(next)
    ;
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
    })
    .catch(next)
    ;
  }
};
