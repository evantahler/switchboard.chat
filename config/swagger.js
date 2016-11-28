var baseUrl = process.env.NODE_ENV === 'production' ? 'www.switchboard.chat' : null;

exports['default'] = {
  swagger: function(api){
    return {
      // Should be changed to hit www.yourserver.com.  If this is null, defaults to ip:port from
      // internal values or from hostOverride and portOverride.
      baseUrl: baseUrl,
      // Specify routes that don't need to be displayed
      ignoreRoutes: [ '/swagger' ],
      // Specify how routes are grouped
      routeTags : {
        'basics'          : [],
        'system'          : [ 'documentation', 'status' ],
        'user'            : [ 'user' ],
        'session'         : [ 'session' ],
        'team'            : [ 'team' ],
        'person'          : [ 'person' ],
        'notification'    : [ 'notification' ],
        'message'         : [ 'message' ],
        'messageCommand'  : [ 'messageCommand' ],
        'billing'         : [ 'billing' ],
        'report'          : [ 'report' ],
        'folder'          : [ 'folder' ],
      },
      // Generate documentation for simple actions specified by action-name
      documentSimpleRoutes: false,
      // Generate documentation for actions specified under config/routes.js
      documentConfigRoutes: true,
      // Set true if you want to organize actions by version
      groupByVersionTag: false,
      // For simple routes, groups all actions under a single category
      groupBySimpleActionTag: false,
      // In some cases where actionhero network topology needs to point elsewhere.  If null, uses
      // api.config.swagger.baseUrl
      hostOverride: null,
      // Same as above, if null uses the internal value set in config/server/web.js
      portOverride: null
    };
  }
};
