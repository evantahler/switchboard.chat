var Stripe = require('stripe');
var async = require('async');
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

module.exports = {
  initialize: function(api, next){
    api.billing = {
      stripe: Stripe(process.env.STRIPE_API_SECRET_KEY),
      chargeMinimum: 50,

      register: function(team, initialStripeToken, email, callback){
        if(
          ( !team.promoCode ) ||
          ( api.config.billing.promoCode && team.promoCode && team.promoCode === api.config.billing.promoCode )
        ){
          api.billing.createStripeUser(team, initialStripeToken, email, function(error){
            if(error){ return callback(error); }
            return api.billing.createMonthlyBillCharge(new Date(), team, callback);
          });
        }else{
          return callback(new Error(team.promoCode + ' is not a valid promotional code.'));
        }
      },

      createStripeUser: function(team, initialStripeToken, email, callback){
        api.billing.stripe.customers.create({
          source: initialStripeToken,
          description: 'Team #' + team.id,
          email: email,
        }).then(function(customer){
          team.updateAttributes({ stripeToken: customer.id }).then(function(){
            callback();
          }).catch(callback);
        }).catch(callback);
      },

      createMonthlyBillCharge: function(now, team, callback){
        var type = 'monthlyTeamCharge';
        var description = 'switchboard.chat monthly charge for `' + team.name + '`';
        var discountValueInCents = 0;

        api.models.charge.findAll({where: [
          'teamId = ? AND type = ? AND month(billingPeriod) = ? AND year(billingPeriod) = ?',
          team.id,
          type,
          (now.getMonth() + 1),
          now.getFullYear()
        ]}).then(function(charge){
          if(charge.length > 0){ return callback(null, charge); }
          if(team.promoCode){ discountValueInCents = api.config.billing.pricePerMonth; }
          api.billing.createCharge(team, api.config.billing.pricePerMonth, 1, description, type, discountValueInCents, now, callback);
        }).catch(callback);
      },

      createExtraMessagesCharge: function(now, team, callback){
        var type = 'monthlyMessagesCharge';
        var description = 'switchboard.chat extra messages charge for `' + team.name + '`';
        var discountValueInCents = 0;

        api.models.charge.findAll({where: [
          'teamId = ? AND type = ? AND month(billingPeriod) = ? AND year(billingPeriod) = ?',
          team.id,
          type,
          (now.getMonth() + 1),
          now.getFullYear()
        ]}).then(function(charge){
          if(charge.length > 0){ return callback(null, charge); }
          api.models.message.count({where: [
              'teamId = ? AND month(createdAt) = ? AND year(createdAt) = ?',
              team.id,
              (now.getMonth() + 1),
              now.getFullYear()
            ]}).then(function(messagesCount){
            if(messagesCount === 0){ return callback(); }
            if(team.promoCode){ discountValueInCents = (messagesCount * api.config.billing.pricePerMessage); }
            description = description + ' (' + messagesCount + ' messages)';
            api.billing.createCharge(team, api.config.billing.pricePerMessage, messagesCount, description, type, discountValueInCents, now, callback);
          }).catch(callback);
        }).catch(callback);
      },

      // should not be called directly!
      createCharge: function(team, unitValueInCents, unitCount, description, type, discountValueInCents, billingPeriod, callback){
        var jobs = [];
        var charge, chargeData;
        var total = (unitCount * unitValueInCents) - discountValueInCents;

        jobs.push(function(done){
          charge = api.models.charge.build({
            teamId: team.id,
            paid: false,
            paidAt: null,
            payload: null,
            type: type,
            valueInCents: total,
            unitValueInCents: unitValueInCents,
            unitCount: unitCount,
            description: description,
            discountValueInCents: discountValueInCents,
            billingPeriod: billingPeriod,
          });

          done();
        });

        jobs.push(function(done){
          charge.save().then(function(){
            done();
          }).catch(done);
        });

        jobs.push(function(done){
          if(charge.valueInCents > 0 && charge.valueInCents >= api.billing.chargeMinimum){
            api.billing.stripe.charges.create({
              amount: charge.valueInCents,
              currency: "usd",
              customer: team.stripeToken,
              description: description
            }, function(error, _chargeData) {
              if(error){
                charge.destroy();
                return done(error);
              }else{
                chargeData = _chargeData;
                done();
              }
            });
          }
          else if(charge.valueInCents < api.billing.chargeMinimum && charge.valueInCents >= 0 ){
            chargeData = {};
            done();
          }
          else{
            done(new Error('You cannot apply a negative charge'));
          }
        });

        jobs.push(function(done){
          charge.updateAttributes({
            paid: true,
            paidAt: new Date(),
            payload: JSON.stringify(chargeData),
          }).then(function(){
            done();
          }).catch(function(error){
            // TODO!?
            api.log(error, 'error');
          });
        });

        async.series(jobs, function(error){
          if(error){ api.log(error, 'error'); }
          callback(error, charge);
        });
      },

    };

    next();
  }
};
