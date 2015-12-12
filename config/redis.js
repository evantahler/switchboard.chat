exports.default = { 
  redis: function(api){
    return {
      package: 'ioredis',
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || 6379,
      database: process.env.REDIS_DATABASE || 0,
      options: {
        pass: process.env.REDIS_PASS || null
      },
    };
  }
};

exports.test = { 
  redis: function(api){
    var package = 'fakeredis';
    if(process.env.FAKEREDIS === 'false'){
      package = 'ioredis';
    }

    return {
      package: package,
      host: '127.0.0.1',
      port: 6379,
      database: 2,
      options: {},
    };
  }
};
