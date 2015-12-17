var async = require('async');

module.exports = {
  initialize: function(api, next){

    api.notifier = {
      workAll: function(callback){
        // TODO: batch size
        api.models.team.findAll().then(function(teams){
          var jobs = [];
          teams.forEach(function(team){
            jobs.push(function(done){
              api.notifier.workTeam(team, done);
            });
          });

          async.parallel(jobs, callback);
        }).catch(callback);
      },

      workTeam: function(team, callback){
        api.models.message.findAll({
          where: {teamId: team.id, read: false},
          order: 'createdAt asc',
          limit: 1,
        }).then(function(messages){
          api.log('checking team #' + team.id + ' for unseen messages');
          if(messages.length === 0){ return callback(); }

          var message = messages[0];
          api.models.user.findAll({where: {teamId: team.id}}).then(function(users){
            var jobs = [];
            users.forEach(function(user){
              jobs.push(function(done){
                api.notifier.workUser(user, team, message, done);
              });
            });

            async.parallel(jobs, callback);
          }).catch(callback);
        }).catch(callback);
      },

      workUser: function(user, team, message, callback){
        api.models.notification.findOne({where: {userId: user.id}}).then(function(notification){
          var jobs = [];

          var emailDeltaMinutes = (new Date() - message.createdAt) / 1000 / 60;
          if(
            notification.notifyByEmail && 
            (!notification.lastEmailNotificationAt || notification.lastEmailNotificationAt < message.createdAt) &&
            emailDeltaMinutes > notification.notificationDelayMinutesEmail
          ){
            jobs.push(function(done){
              api.notifier.notifyEmail(user, notification, team, message, done);
            });
          }

          var smsDeltaMinutes = (new Date() - message.createdAt) / 1000 / 60;
          if(
            notification.notifyBySMS && 
            (!notification.lastSMSNotificationAt || notification.lastSMSNotificationAt < message.createdAt) &&
            smsDeltaMinutes > notification.notificationDelayMinutesSMS
          ){
            jobs.push(function(done){
              api.notifier.notifySMS(user, notification, team, message, done);
            });
          }

          async.series(jobs, callback);
        }).catch(callback);
      },

      notifySMS: function(user, notification, team, message, callback){
        api.log('notify user #' + user.id + ' of unseen messages via SMS');
        if(!user.phoneNumber){ return callback(); }

        notification.updateAttributes({lastSMSNotificationAt: new Date()}).then(function(){

          var notificationMessage = api.models.message.build({
            from:      team.phoneNumber,
            to:        user.phoneNumber,
            message:   '[switchboard.chat] Your team, `' + team.name + '`, has unread messages',
            direction: 'out',
            read:      false,
            teamId:    team.id,
          });

          var payload = {
            to:   notificationMessage.to,
            from: notificationMessage.from,
            body: notificationMessage.message,
          };

          api.twilio.client.sendMessage(payload, function(error){
            if(error){ 
              api.log(error, 'error'); 
              return callback(error);
            }
            notificationMessage.save().then(function(){
              callback();
            }).catch(error);
          });

        }).catch(callback);
      },

      notifyEmail: function(user, notification, team, message, callback){
        api.log('notify user #' + user.id + ' of unseen messages via Email');
        if(!user.email){ return callback(); }

        var email = {
          from:    api.config.smtp.auth.user,
          to:      user.email,
          subject: '[switchboard.chat] Your team, "' + team.name + '", has unread messages',
          html:    '[switchboard.chat] Your team, <strong>' + team.name + '</strong>, has unread messages.  Visit <a href="https://switchboard.chat">switchboard.chat</a> to log in and read them.',
        };
        
        api.smtp.client.sendMail(email, function(error){
          if(error){ 
            api.log(error, 'error'); 
            return callback(error); 
          }
          notification.updateAttributes({lastEmailNotificationAt: new Date()}).then(function(){
            callback();
          }).catch(callback);
        });
      }
    };

    next();
  } 
};
