var async = require('async');

module.exports = {
  initialize: function(api, next){

    api.notifier = {
      notifyUser: function(user, team, callback){
        var jobs = [];
        var messages;
        var notification;

        jobs.push(function(done){
          api.models.message.findAll({
            where: {teamId: team.id, read: false, direction: 'in'},
            order: 'createdAt asc',
          }).then(function(_messages){
            messages = _messages;
            done();
          }).catch(done);
        });

        jobs.push(function(done){
          api.models.notification.findOne({
            where: {userId: user.id}
          }).then(function(_notification){
            notification = _notification;
            done();
          }).catch(done);
        });

        jobs.push(function(done){
          if(messages.length === 0){ return done(); }

          var emailDeltaMinutes = (new Date() - messages[0].createdAt) / 1000 / 60;
          if(
            notification.notifyByEmail && 
            (!notification.lastEmailNotificationAt || notification.lastEmailNotificationAt < messages[0].createdAt) &&
            emailDeltaMinutes > notification.notificationDelayMinutesEmail
          ){
            api.notifier.notifyUserViaEmail(user, notification, team, messages, done);
          }else{
            done();
          }
        });

        jobs.push(function(done){
          if(messages.length === 0){ return done(); }

          var smsDeltaMinutes = (new Date() - messages[0].createdAt) / 1000 / 60;
          if(
            notification.notifyBySMS && 
            (!notification.lastSMSNotificationAt || notification.lastSMSNotificationAt < messages[0].createdAt) &&
            smsDeltaMinutes > notification.notificationDelayMinutesSMS
          ){
            api.notifier.notifyUserViaSMS(user, notification, team, messages, done);
          }else{
            done();
          }
        });

        async.series(jobs, callback);
      },

      notifyUserViaSMS: function(user, notification, team, messages, callback){
        api.log('notify user #' + user.id + ' of unseen messages via SMS');
        if(!user.phoneNumber){ return callback(); }

        notification.updateAttributes({lastSMSNotificationAt: new Date()}).then(function(){
          var body = '[switchboard.chat] Your team, "' + team.name + '", has ' + messages.length + ' unread message(s)';
          api.twilio.sendMessage(team, user, body, callback);
        }).catch(callback);
      },

      notifyUserViaEmail: function(user, notification, team, messages, callback){
        api.log('notify user #' + user.id + ' of unseen messages via Email');
        if(!user.email){ return callback(); }

        var subject = 'Your team, "' + team.name + '", has unread messages';
        var emailData = {
          paragraphs:[
            'Your team, "' + team.name + '", has ' + messages.length + ' unread messages:',
            'Visit switchboard.chat to log in and read them.',
            '----------------------------------',
          ],
          cta: 'Log in Now',
          ctaLink: process.env.PUBLIC_URL + '/#/login',
          signoff: 'Thanks, the switchboard.chat team.',
          greeting: 'Hi, ' + user.firstName,
        };

        messages.forEach(function(message){
          var stanza = '[ ' + message.from + ' ] ' + message.message;
          emailData.paragraphs.push(stanza);
        });

        api.smtp.send(user.email, subject, emailData, function(error){
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
