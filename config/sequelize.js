exports.default = {
  sequelize: function(api){
    return {
      "autoMigrate" : false,
      "loadFixtures": false,
      "dialect"     : "mysql",
      "port"        : parseInt( process.env.MYSQL_PORT ),
      "database"    : process.env.MYSQL_DATABASE,
      "host"        : process.env.MYSQL_HOST,
      "username"    : process.env.MYSQL_USER,
      "password"    : process.env.MYSQL_PASS,
      "logging"     : false,
      pool: {
        max: 4,
        min: 0,
        idle: 1000
      },
    };
  }
};

exports.test = {
  sequelize: function(api){
    return {
      "autoMigrate" : false,
      "loadFixtures": false,
      "dialect"     : "mysql",
      "port"        : 3306,
      "database"    : 'switchboard_test',
      "host"        : 'localhost',
      "username"    : 'root',
      "password"    : null,
      "logging"     : false,
    };
  }
};
