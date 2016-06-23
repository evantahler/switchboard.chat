var host     = process.env.REDIS_HOST || '127.0.0.1';
var port     = process.env.REDIS_PORT || 6379;
var database = process.env.REDIS_DB   || 0;

exports['default'] = {
  redis: function(api){
    var Redis;
    if(process.env.FAKEREDIS === 'false' || process.env.REDIS_HOST !== undefined){
      Redis = require('ioredis');
    }else{
      Redis = require('fakeredis');
    }

    return {
      '_toExpand': false,
      // create the redis clients
      client:     Redis.createClient(port, host, {fast: true}),
      subscriber: Redis.createClient(port, host, {fast: true}),
      tasks:      Redis.createClient(port, host, {fast: true}),
    };
  }
};

exports.test = {
  redis: function(api){
    if(process.env.FAKEREDIS === 'false'){
      var Redis = require('ioredis');
      return {
        '_toExpand': false,

        client:     new Redis({host: host, port: port, db: database}),
        subscriber: new Redis({host: host, port: port, db: database}),
        tasks:      new Redis({host: host, port: port, db: database}),
      };
    }else{
      var Redis = require('fakeredis');
      return {
        '_toExpand': false,

        client:     Redis.createClient(port, host, {fast: true}),
        subscriber: Redis.createClient(port, host, {fast: true}),
        tasks:      Redis.createClient(port, host, {fast: true}),
      };
    }
  }
};

















exports.default = {
  redis: function(api){
    var redisDetails = {
      // Which channel to use on redis pub/sub for RPC communication
      channel: 'actionhero',
      // How long to wait for an RPC call before considering it a failure
      rpcTimeout: 5000,
      // which redis package should you ise?
      pkg: 'ioredis',

      // Basic configuration options
      host     : process.env.REDIS_HOST || '127.0.0.1',
      port     : process.env.REDIS_PORT || 6379,
      database : process.env.REDIS_DB   || 0,
    };

    if( process.env.FAKEREDIS === 'false' || process.env.REDIS_HOST !== undefined ){
      redisDetails.pkg  = 'ioredis';
      // there are many more connection options, including support for cluster and sentinel
      // learn more @ https://github.com/luin/ioredis
      redisDetails.options  = {
        password: (process.env.REDIS_PASS || null),
      };
    }

    return redisDetails;
  }
};

exports.test = {
  redis: function(api){
    var pkg = 'fakeredis';
    if(process.env.FAKEREDIS === 'false'){
      pkg = 'ioredis';
    }

    return {
      pkg: pkg,
      host: '127.0.0.1',
      port: 6379,
      database: 2,
      options: {},
    };
  }
};
