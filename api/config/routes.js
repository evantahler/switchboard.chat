exports['default'] = {
  routes: (api) => {
    return {
      get: [
        { path: '/system/status', action: 'system:status' },
        { path: '/system/version', action: 'system:version' },
        { path: '/user', action: 'user:view' },
        { path: '/team', action: 'team:view' },
        { path: '/teams', action: 'teams:list' },
        { path: '/teamMembers', action: 'teamMembers:list' },
        { path: '/folders', action: 'folders:list' },
        { path: '/contacts', action: 'contacts:list' },
        { path: '/twilio/listNumbers', action: 'twilio:listNumbers' }
      ],

      put: [
        { path: '/user', action: 'user:create' },
        { path: '/team', action: 'team:create' },
        { path: '/session', action: 'session:create' },
        { path: '/teamMember', action: 'teamMember:create' },
        { path: '/folder', action: 'folder:create' },
        { path: '/contact', action: 'contact:create' }
      ],

      post: [
        { path: '/user', action: 'user:edit' },
        { path: '/team', action: 'team:edit' }
      ],

      delete: [
        { path: '/session', action: 'session:destroy' },
        { path: '/teamMember', action: 'teamMember:destroy' },
        { path: '/folder', action: 'folder:destroy' },
        { path: '/contact', action: 'contact:destroy' }
      ]
    }
  }
}
