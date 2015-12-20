var Twilio = require('twilio');

module.exports = {
  initialize: function(api, next){
    api.twilio = {
      client: Twilio(api.config.twilio.ssid, api.config.twilio.token),

      sanitize: function(number){
        number = number.replace(/\D+/g, '');
        if (number.length === 10){ number = '1' + number; }
        return number;
      },

      registerTeamPhoneNumber: function(team, callback){
        var countryCode = 'US';

        api.twilio.client.availablePhoneNumbers(countryCode).local.list({ areaCode: team.areaCode }, function(error, numbers){
          if(error){ return callback(error); }
          if(numbers.length === 0 || !numbers.available_phone_numbers[0]){ 
            return callback(new Error('No phone numbers availalbe for this area code')); 
          }

          var phoneNumber = numbers.available_phone_numbers[0].phone_number;
          team.phoneNumber = api.twilio.sanitize(phoneNumber);
          api.twilio.client.incomingPhoneNumbers.create({phoneNumber: phoneNumber}, function(err, purchasedNumber){
            team.sid = purchasedNumber.sid;
            team.save().then(function(){ 
              api.twilio.updateIncommingUrl(team, callback);
            }).catch(callback);
          });
        });
      },

      realeaseTeamPhoneNumber: function(team, callback){
        api.twilio.client.incomingPhoneNumbers(team.sid).release(callback);
      },

      updateIncommingUrl: function(team, callback){
        var url = api.config.twilio.messageUrl;
        url.replace(/https/, 'http'); //hack for twilio and bad HTTPS certs
        api.twilio.client.incomingPhoneNumbers(team.sid).update({smsUrl: api.config.twilio.messageUrl}, callback);
      },

      sendMessage: function(team, person, body, callback){
        var from = api.twilio.sanitize(team.phoneNumber);
        var to   = api.twilio.sanitize(person.phoneNumber);

        var message = api.models.message.build({
          from:      from,
          to:        to,
          message:   body,
          direction: 'out',
          read:      true,
          teamId:    team.id,
        });

        message.save().then(function(){
          // sleep between message to attempt to have them send in order
          setTimeout(function(){
            api.twilio.client.sendMessage({ 
              to: to, 
              from: from, 
              body: message.message
            }, function(error){
              if(error){ return callback(error); }
              api.chatRoom.broadcast({}, 'team:' + team.id, message.apiData(api) );
              callback();
            });
          }, 500);
        }).catch(callback);
      },

    };

    next();
  }
};