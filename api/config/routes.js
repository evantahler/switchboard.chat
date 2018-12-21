exports['default'] = {
  routes: (api) => {
    return {
      get: [
        { path: '/system/status', action: 'system:status' },
        { path: '/system/version', action: 'system:version' },
        { path: '/user', action: 'user:view' }
      ],

      put: [
        { path: '/user', action: 'user:create' },
        { path: '/session', action: 'session:create' }
      ],

      post: [
        { path: '/user', action: 'user:edit' }
      ],

      delete: [
        { path: '/session', action: 'session:destroy' }
      ]
    }
  }
}
