exports.default = {
  sequelize: (api) => {
    return {
      autoMigrate: true,
      loadFixtures: false,
      logging: false,
      dialect: 'mysql',
      port: parseInt(process.env.MYSQL_PORT),
      database: process.env.MYSQL_DATABASE,
      host: process.env.MYSQL_HOST,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      modelsDir: ['models'],
      migrationsDir: ['migrations']
    }
  }
}

exports.test = {
  sequelize: (api) => {
    return {
      port: 3306,
      database: 'switchboard_test',
      host: 'localhost',
      username: 'root',
      password: undefined
    }
  }
}
