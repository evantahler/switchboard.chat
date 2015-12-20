exports.default = { 
  routes: function(api){
    return {
      
      get: [
        { path: '/user',                 action: 'user:view' },
        { path: '/team',                 action: 'team:view' },
        { path: '/person',               action: 'person:view' },
        { path: '/notification',         action: 'notification:view' },
        { path: '/user/list',            action: 'user:list' },
        { path: '/person/list',          action: 'person:list' },
        { path: '/message/list',         action: 'message:list' },
        { path: '/messageCommand/list',  action: 'messageCommand:list' },
      ],

      post: [
        { path: '/session',              action: 'session:create' },
        { path: '/user',                 action: 'user:create' },
        { path: '/user/forgot-password', action: 'user:forgot-password' },
        { path: '/user/reset-password',  action: 'user:reset-password' },
        { path: '/team',                 action: 'team:comboCreate' },
        { path: '/person',               action: 'person:create' },
        { path: '/message/in',           action: 'message:in' },
        { path: '/message/out',          action: 'message:out' },
      ],

      put: [
        { path: '/session',              action: 'session:check' },
        { path: '/user',                 action: 'user:edit' },
        { path: '/team',                 action: 'team:edit' },
        { path: '/person',               action: 'person:edit' },
        { path: '/notification',         action: 'notification:edit' },
        { path: '/message/read',         action: 'message:read' },
      ],

      delete: [
        { path: '/session',              action: 'session:destroy' },
        { path: '/user',                 action: 'user:delete' },
        { path: '/team',                 action: 'team:delete' },
        { path: '/person',               action: 'person:delete' },
      ],
            
    };
  }
};