exports.personView = {
  name:                   'report:list',
  description:            'report:list',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {},

  run: function(api, data, next){
    data.response.reports = {};
    api.models.team.findOne({where: {id: data.session.teamId}}).then(function(team){
      if(!team){ return next(new Error('team not found')); }
      
      var query = '';
      query += ' SELECT                                                                   ';
      query += '   count(1) AS "count",                                                   ';
      query += '   YEAR(messages.createdAt) AS "year",                                    ';
      query += '   MONTH(messages.createdAt) AS "month",                                  ';
      query += '   peopleTo.id AS "toId",                                                 ';
      query += '   CONCAT(peopleTo.firstName, " ", peopleTo.lastName) AS "toName",        ';
      query += '   peopleFrom.id AS "fromId",                                             ';
      query += '   CONCAT(peoplefrom.firstName, " ", peopleFrom.lastName) AS "fromName"   ';
      query += ' FROM messages                                                            ';
      query += ' LEFT JOIN people AS peopleTo   ON peopleTo.phoneNumber = messages.to     ';
      query += ' LEFT JOIN people AS peopleFrom ON peopleFrom.phoneNumber = messages.from ';
      query += ' WHERE messages.teamId = :teamId                                          ';
      query += ' GROUP BY YEAR, MONTH, peopleTo.id, peopleFrom.id                         ';

      api.sequelize.sequelize.query(query,{
        replacements: { teamId: team.id }, 
        type: api.sequelize.sequelize.QueryTypes.SELECT }
      ).then(function(rows) {
        rows.forEach(function(row){
          var date = row.year + ' ' + row.month;
          var name = 'Unknown Person';
          if(row.toId){ name = row.toName; }
          if(row.fromId){ name = row.fromName; }

          if(!data.response.reports[name]){ data.response.reports[name] = {}; }
          data.response.reports[name][date] = row.count;        
        });

        next();
      }).catch(next);
    });
  }
};