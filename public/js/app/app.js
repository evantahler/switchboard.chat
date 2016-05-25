/////////////
// HELPERS //
/////////////

var routes = [
  // ROUTE               PAGE PARTIAL                       PAGE TITLE                      REQUIRE LOGIN
  [ '/',                 'pages/home.html',                 'switchboard',                  false ],
  [ '/home',             'pages/home.html',                 'switchboard',                  false ],
  [ '/about',            'pages/about.html',                'switchboard: About',           false ],
  [ '/sign-up',          'pages/team/create.html',          'switchboard: Create Team',     false ],
  [ '/login',            'pages/session/create.html',       'switchboard: Log In',          false ],
  [ '/logout',           'pages/session/destroy.html',      'switchboard: Log Out',         false ],
  [ '/forgot-password',  'pages/user/forgot-password.html', 'switchboard: Forgot Password', false ],
  [ '/reset-password',   'pages/user/reset-password.html',  'switchboard: Reset Password',  false ],
  [ '/new-password',     'pages/user/new-password.html',    'switchboard: Change Password', false ],
  [ '/commands',         'pages/messageCommand.html',       'switchboard: Commands',        false ],
  [ '/messages',         'pages/messages.html',             'switchboard: Messages',        true  ],
  [ '/address-book',     'pages/address-book.html',         'switchboard: Address Book',    true  ],
  [ '/billing',          'pages/billing.html',              'switchboard: Billing',         true  ],
  [ '/account',          'pages/account.html',              'switchboard: Account',         true  ],
  [ '/team',             'pages/team.html',                 'switchboard: Team',            true  ],
  [ '/welcome',          'pages/welcome.html',              'switchboard: Welcome',         true  ],
];

/////////////////
// APPLICATION //
/////////////////

var app = angular.module('app', ['ngRoute', 'ngNotify']);

app.config(function($routeProvider, $locationProvider){

  routes.forEach(function(collection){
    var route = collection[0];
    var page  = collection[1];
    var title = collection[2];
    $routeProvider.when(route, {
      'templateUrl': page,
      'pageTitle': title
    });
  });

  // $locationProvider.html5Mode(true);
});

app.run(['$rootScope', '$http', 'ngNotify', function($rootScope, $http, ngNotify){

  $rootScope.user    = null;
  $rootScope.team    = null;
  $rootScope.billing = {};
  $rootScope.routes  = routes;

  ngNotify.config({
    theme: 'pure',
    position: 'bottom',
    duration: 3000,
    type: 'info',
    sticky: false,
    button: true,
    html: false
  });

  $rootScope.authenticatedActionHelper = function($scope, data, path, verb, successCallback, errorCallback){
    if(!$rootScope.csrfToken){
      setTimeout(function(){
        console.log('await csrfToken for ' + path)
        $rootScope.authenticatedActionHelper($scope, data, path, verb, successCallback, errorCallback);
      }, 1000);
    }else{
      $rootScope.actionHelper($scope, data, path, verb, successCallback, errorCallback);
    }
  };

  $rootScope.actionHelper = function($scope, data, path, verb, successCallback, errorCallback){
    var i;

    $('button').prop('disabled', true);

    if(typeof successCallback !== 'function'){
      successCallback = function(data){
        var successMessage = 'OK!';
        if(data.message){ successMessage = data.message; }
        ngNotify.set(successMessage, 'success');
      };
    }

    if(typeof errorCallback !== 'function'){
      errorCallback = function(errorMessage){ ngNotify.set(errorMessage, 'error'); };
    }

    if(!data.csrfToken){ data.csrfToken = $rootScope.csrfToken; }

    for(i in data){
      if(data[i] === null || data[i] === undefined){ delete data[i]; }
    }

    if(Object.keys(data).length > 0 && (verb === 'get' || verb === 'GET') && path.indexOf('?') < 0){
      path += '?';
      for(i in data){ path += i + '=' + data[i] + '&'; }
    }

    $http({
      method  : verb,
      url     : path,
      data    : $.param(data),  // pass in data as strings
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
     }).success(function(data){
       $('button').prop('disabled', false);
      successCallback(data);
    }).catch(function(data){
      var errorMessage = '';
      if(data.data && data.data.error){
        errorMessage = data.data.error;
      }else{
        errorMessage = data.statusText + ' | ' + data.status;
      }
      errorCallback(errorMessage);
      setTimeout(function(){
        $('button').prop('disabled', false);
      }, 500);
    });
  };

  $rootScope.audio = {
    1: new Audio('/sounds/ding-1.mp3'),
    2: new Audio('/sounds/ding-2.mp3'),
  };

  $rootScope.formatters = {
    phoneNumber: function(p){
      p = p.replace(/\D+/g, '');
      if(p.length === 10){ p = '1' + p; }
      p = p.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '$2.$3.$4');
      return p;
    },
    timestamp: function(p){
      var d = Date.parse(p);
      return moment(d).fromNow();
    }
  };

  $rootScope.$on('$routeChangeSuccess', function (event, current, previous){
    // change page title
    $rootScope.pageTitle = current.$$route.pageTitle;

    // notifiy google analyttics
    ga('set', 'page', current.$$route.originalPath);
    ga('send', 'pageview');
  });
}]);
