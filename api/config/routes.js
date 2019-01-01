exports['default'] = {
  routes: (api) => {
    return {
      get: [
        { path: '/system/status', action: 'system:status' },
        { path: '/system/version', action: 'system:version' },
        { path: '/user', action: 'user:view' },
        { path: '/team', action: 'team:view' },
        { path: '/team/billing', action: 'team:view:billing' },
        { path: '/teams', action: 'teams:list' },
        { path: '/teamMembers', action: 'teamMembers:list' },
        { path: '/folders', action: 'folders:list' },
        { path: '/contacts', action: 'contacts:list' },
        { path: '/messages', action: 'messages:list' },
        { path: '/twilio/listNumbers', action: 'twilio:listNumbers' }
      ],

      put: [
        { path: '/user', action: 'user:create' },
        { path: '/team', action: 'team:create' },
        { path: '/session', action: 'session:create' },
        { path: '/teamMember', action: 'teamMember:create' },
        { path: '/folder', action: 'folder:create' },
        { path: '/contact', action: 'contact:create' },
        { path: '/message', action: 'message:send' }
      ],

      post: [
        { path: '/user', action: 'user:edit' },
        { path: '/team', action: 'team:edit' },
        { path: '/teamMember', action: 'teamMember:edit' },
        { path: '/twilio/in', action: 'twilio:in' },
        { path: '/twilio/voice', action: 'twilio:voice' },
        { path: '/folder', action: 'folder:edit' },
        { path: '/contact', action: 'contact:edit' }
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
