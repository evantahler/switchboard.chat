var crypto = require('crypto');

exports.userCreate = {
  name:                   'user:create',
  description:            'user:create',
  outputExample:          {},
  middleware:             [],

  inputs: {
    email:       { required: true },
    phoneNumber: { required: false },
    password:    { required: true },
    firstName:   { required: true },
    lastName:    { required: true },
    teamId:      { required: true },
  },

  run: function(api, data, next){
    if(data.params.phoneNumber){  
      data.params.phoneNumber = api.twilio.sanitize(data.params.phoneNumber);
    }

    var user = api.models.user.build(data.params);
    user.updatePassword(data.params.password, function(error){
      if(error){ return next(error); }

      api.models.team.findOne({where: {id: data.params.teamId}}).then(function(team){
        if(!team){ return next(new Error('team not found')); }

        user.save().then(
          api.models.user.findOne({where: {email: data.params.email}})
        ).then(function(userObj){
          data.response.user = userObj.apiData(api);
          var notification = api.models.notification.build({
            userId: userObj.id,
          });

          notification.save().then(function(){
            var subject = '[switchboard.chat] Welcome to switchboard.chat';

            var html = '';
            html += '<p>You have been invited to the team "' + team.name + '".</p>';
            html += '<p>Log in information:';
            html += '<ul>';
            html += '<li>email: ' + data.params.email + '</li>';
            html += '<li>password: ' + data.params.password + '</li>';
            html += '</ul></p>';
            html += '<p>Visit <a href="https://switchboard.chat">switchboard.chat</a> to log in!</p>';

            api.smtp.send(user.email, subject, html, next);
          }).catch(function(errors){
            next(errors.errors[0].message);
          });        
        }).catch(function(errors){
          next(errors.errors[0].message);
        });
      }).catch(next);
    });
  }
};

exports.userView = {
  name:                   'user:view',
  description:            'user:view',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {
    userId: {
      required: true,
      formatter: function(p){ return parseInt(p); }
    }
  },

  run: function(api, data, next){
    api.models.user.findOne({where: {id: data.params.userId, teamId: data.session.teamId}}).then(function(user){
      if(!user){ return next(new Error('user not found')); }
      data.response.user = user.apiData(api);
      next();
    }).catch(next);
  }
};

exports.userList = {
  name:                   'user:list',
  description:            'user:list',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {},

  run: function(api, data, next){
    api.models.user.findAll({
      where: {teamId: data.session.teamId},
      order: 'lastName asc',
    }).then(function(users){
      data.response.users = [];
      users.forEach(function(user){
        data.response.users.push( user.apiData(api) );
      });
      next();
    }).catch(next);
  }
};

exports.userEdit = {
  name:                   'user:edit',
  description:            'user:edit',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {
    userId: {
      required: true,
      formatter: function(p){ return parseInt(p); }
    },
    email:       { required: false },
    phoneNumber: { required: false },
    password:    { required: false },
    firstName:   { required: false },
    lastName:    { required: false },
  },

  run: function(api, data, next){
    if(data.params.phoneNumber){  
      data.params.phoneNumber = api.twilio.sanitize(data.params.phoneNumber);
    }
    
    api.models.user.findOne({where: {id: data.params.userId, teamId: data.session.teamId}}).then(function(user){
      if(!user){ return next(new Error('user not found')); }
      user.updateAttributes(data.params).then(function(){
        data.response.user = user.apiData(api);
        if(data.params.password){
          user.updatePassword(data.params.password, function(error){
            if(error){ return next(error); }
            user.save().then(function(){
              next();
            }).catch(next);
          });
        }else{
          next();
        }
      }).catch(next);
    }).catch(next);
  }
};

exports.userForgotPassword = {
  name:                   'user:forgot-password',
  description:            'user:forgot-password',
  outputExample:          {},
  middleware:             [],

  inputs: {
    email: { required: true }
  },

  run: function(api, data, next){
    data.response.message = 'Check your email for a link to continue.'; // send this no matter what
    api.models.user.findOne({where: {email: data.params.email }}).then(function(user){
      if(!user){ return next(); }
      require('crypto').randomBytes(48, function(ex, buf) {
        var token = buf.toString('hex');
        user.passwordResetToken = token;
        user.save().then(function(){
          var subject = '[switchboard.chat] Your password reset link';
          var html    = '<p>You have requested a link to update your password.</p>';
          html += '<p>Click here: ' + process.env.PUBLIC_URL + '/#/reset-password?userId=' + user.id + '&token=' + token + '</p>';
          api.smtp.send(user.email, subject, html, next);
        }).catch(next);
      });
    }).catch(next);
  }
};

exports.userResetPassword = {
  name:                   'user:reset-password',
  description:            'user:reset-password',
  outputExample:          {},
  middleware:             [],

  inputs: {
    userId: {
      required: true,
      formatter: function(p){ return parseInt(p); }
    },
    passwordResetToken: { required: true },
    password:           { required: true },
  },

  run: function(api, data, next){
    api.models.user.findOne({where: {id: data.params.userId }}).then(function(user){
      if(!user){ return next(new Error('user not found')); }
      if(!user.passwordResetToken){ return next(new Error('user not found')); }
      if(user.passwordResetToken !== data.params.passwordResetToken){ return next(new Error('user not found')); }

      user.updatePassword(data.params.password, function(error){
        if(error){ return next(error); }
        user.passwordResetToken = null;
        user.save().then(function(){
          next();
        }).catch(next);
      });
    }).catch(next);
  }
};

exports.userDelete = {
  name:                   'user:delete',
  description:            'user:delete',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {
    userId: {
      required: true,
      formatter: function(p){ return parseInt(p); }
    }
  },

  run: function(api, data, next){
    if(data.session.userId === data.params.userId){
      return next(new Error('you cannot delete yourself'));
    }

    api.models.user.findOne({where: {id: data.params.userId, teamId: data.session.teamId}}).then(function(user){
      if(!user){ return next(new Error('user not found')); }
      user.destroy().then(function(){ 
        api.models.notification.findOne({where: {userId: data.params.userId}}).then(function(notification){
          notification.destroy().then(function(){
            next();
          }).catch(next);
        }).catch(next);
      }).catch(next);
    }).catch(next);
  }
};
