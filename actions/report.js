exports.reportUsage = {
  name:                   'report:usage',
  description:            'report:usage',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {},

  run: function(api, data, next){
    data.response.reports = {};
    api.models.team.findOne({where: {id: data.session.teamId}}).then(function(team){
      if(!team){ return next(new Error('team not found')); }

      var query = '';
      query += ' SELECT                                                                                                       ';
      query += '   count(1) AS "count"                                                                                        ';
      query += '   , YEAR(X.createdAt) AS "year"                                                                              ';
      query += '   , MONTH(X.createdAt) AS "month"                                                                            ';
      query += '   , people.id AS "personId"                                                                                  ';
      query += '   , CONCAT(firstName, " ", lastName) AS "name"                                                               ';
      query += ' FROM (                                                                                                       ';
      query += ' 	SELECT *,                                                                                                   ';
      query += ' 	  CASE WHEN messages.from = :teamPhoneNumber THEN messages.to ELSE messages.from END AS "personPhoneNumber" ';
      query += ' 	  FROM messages                                                                                             ';
      query += ' 	  WHERE teamId = :teamId                                                                                    ';
      query += ' ) AS X                                                                                                       ';
      query += ' LEFT JOIN people ON people.phoneNumber = X.personPhoneNumber                                                 ';
      query += ' WHERE people.teamId = :teamId                                                                                ';
      query += ' GROUP BY people.id, YEAR(X.createdAt), MONTH(X.createdAt);                                                   ';

      api.sequelize.sequelize.query(query,{
        replacements: { teamId: team.id, teamPhoneNumber: team.phoneNumber },
        type: api.sequelize.sequelize.QueryTypes.SELECT }
      ).then(function(rows) {
        rows.forEach(function(row){
          var date = row.year + ' - ' + row.month;
          if(!data.response.reports[row.name]){ data.response.reports[row.name] = {}; }
          data.response.reports[row.name][date] = row.count;
        });

        next();
      }).catch(next);
    });
  }
};

exports.reportBilling = {
  name:                   'report:billing',
  description:            'report:billing',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {},

  run: function(api, data, next){
    data.response.reports = {
      charges: []
    };
    api.models.team.findOne({where: {id: data.session.teamId}}).then(function(team){
      if(!team){ return next(new Error('team not found')); }
      api.models.charge.findAll({
        where: {teamId: team.id},
        order: 'paidAt desc',
      }).then(function(charges){
        charges.forEach(function(charge){
          data.response.reports.charges.push( charge.apiData(api) );
        });

        next();
      }).catch(next);
    });
  }
};
