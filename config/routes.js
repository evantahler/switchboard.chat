exports.default = { 
  routes: function(api){
    return {
      
      get: [
        { path: '/user',                  action: 'user:view' },
      ],

      post: [
        { path: '/session',               action: 'session:create' },
        { path: '/user',                  action: 'user:create' },
        { path: '/sms/in',                action: 'sms:in' },
        { path: '/sms/out',               action: 'sms:out' },
      ],

      put: [
        { path: '/session',               action: 'session:check' },
        { path: '/user',                  action: 'user:edit' },
      ],

      delete: [
        { path: '/session',               action: 'session:destroy' },
      ],
            
    };
  }
};