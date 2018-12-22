exports['default'] = {
  routes: (api) => {
    return {
      get: [
        { path: '/system/status', action: 'system:status' },
        { path: '/system/version', action: 'system:version' },
        { path: '/user', action: 'user:view' },
        { path: '/team', action: 'team:view' },
        { path: '/teams', action: 'teams:list' },
        { path: '/teamMembers', action: 'teamMembers:list' }
      ],

      put: [
        { path: '/user', action: 'user:create' },
        { path: '/team', action: 'team:create' },
        { path: '/session', action: 'session:create' },
        { path: '/teamMember', action: 'teamMember:create' }
      ],

      post: [
        { path: '/user', action: 'user:edit' },
        { path: '/team', action: 'team:edit' }
      ],

      delete: [
        { path: '/session', action: 'session:destroy' },
        { path: '/teamMember', action: 'teamMember:destroy' }
      ]
    }
  }
}
