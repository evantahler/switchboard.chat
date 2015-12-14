/////////////
// HELPERS //
/////////////

var routes = [
  // ROUTE              PAGE PARTIAL                        PAGE TITLE                      REQUIRE LOGIN
  [ '/',                'pages/home.html',                  'switchboard',                  false ],
  [ '/home',            'pages/home.html',                  'switchboard',                  false ],
  [ '/about',           'pages/about.html',                 'switchboard: About',           false ],
  [ '/sign-up',         'pages/team/create.html',           'switchboard: Create Team',     false ],
  [ '/login',           'pages/session/create.html',        'switchboard: Log In',          false ],
  [ '/logout',          'pages/session/destroy.html',       'switchboard: Log Out',         false ],
  [ '/forgot-password', 'pages/user/forgot-password.html',  'switchboard: Forgot Password', false ],
  [ '/reset-password',  'pages/user/reset-password.html',   'switchboard: Reset Password',  false ],
  [ '/messages',        'pages/messages.html',              'switchboard: Messages',        true  ],
  [ '/people',          'pages/people.html',                'switchboard: People',          true  ],
  [ '/account',         'pages/account.html',               'switchboard: Account',         true  ],
  [ '/team',            'pages/team.html',                  'switchboard: Team',            true  ],
];

/////////////////
// APPLICATION //
/////////////////

var app = angular.module('app', ['ngRoute']);

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

app.run(['$rootScope', '$http', function($rootScope, $http){

  $rootScope.user   = null;
  $rootScope.team   = null;
  $rootScope.people = null;
  $rootScope.routes = routes;

  $rootScope.actionHelper = function($scope, data, path, verb, successCallback, errorCallback){
    var i;

    $('button').prop('disabled', true);

    if(typeof errorCallback !== 'function'){
      errorCallback = function(errorMessage){
        $scope.error = errorMessage;
      };
    }

    if(!data.csrfToken){ data.csrfToken = $rootScope.csrfToken; }

    for(i in data){
      if(data[i] === null || data[i] === undefined){ delete data[i]; }
    }

    if(Object.keys(data).length > 0 && (verb === 'get' || verb === 'GET') && path.indexOf('?') < 0){
      path += '?';
      for(i in data){
        path += i + '=' + data[i] + '&';
      }
    }

    $http({
      method  : verb,
      url     : path,
      data    : $.param(data),  // pass in data as strings
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
     }).success(function(data){
      successCallback(data);
      $('button').prop('disabled', false);
    }).catch(function(data){
      var errorMessage = '';
      if(data.data && data.data.error){
        errorMessage = data.data.error;
      }else{
        errorMessage = data.statusText + ' | ' + data.status;
      }
      errorCallback(errorMessage);
      $('button').prop('disabled', false);
    });
  };

  $rootScope.audio = {
    1: new Audio('/sounds/ding-1.mp3'),
    2: new Audio('/sounds/ding-2.mp3'),
  };

  $rootScope.formatters = {
    phoneNumber: function(p, toName){
      p = p.replace(/\D+/g, '');
      if(p.length === 10){ p = '1' + p; }

      if(toName !== false){
        if(String(p) === $rootScope.team.phoneNumber){
          return '{{' + $rootScope.team.name + '}}';
        }

        for(var i in $rootScope.people){
          var person = $rootScope.people[i];
          if(String(person.phoneNumber) === String(p)){
            return person.firstName + ' ' + person.lastName;
          }
        }
      }

      p = p.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '$2.$3.$4');
      return p;
    },
    timestamp: function(p){
      var d = Date.parse(p);
      return moment(d).fromNow();
    }
  };

  $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
    $rootScope.pageTitle = current.$$route.pageTitle;
  });
}]);

app.controller('pageController', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
  
  $scope.date = new Date();

  $rootScope.actionHelper($scope, {}, '/api/session', 'PUT', function(data){
    if(data.user){
      $rootScope.user      = data.user; 
      $rootScope.csrfToken = data.csrfToken; 
      
      $rootScope.actionHelper($scope, {}, '/api/team', 'GET', function(data){
        if(data.team){ $rootScope.team = data.team;  }
      });

      $rootScope.actionHelper($scope, {}, '/api/person/list', 'GET', function(data){
        if(data.people){ $rootScope.people = data.people;  }
      });
    }
  }, function(error){
    var matchedAndOK = false;
    var path = $location.path();

    $rootScope.routes.forEach(function(r){
      if( !matchedAndOK && path === r[0] && r[3] === false ){
        matchedAndOK = true;
      } 
    });

    if(matchedAndOK){
      // OK to be here logged-out
    }else{
      $location.path('/');
    }
  });
  
  $scope.getNavigationHighlight = function(path){
    var parts = $location.path().split('/');
    var simplePath = parts[(parts.length - 1)];
    if (simplePath == path) {
      return "active";
    }else{  
      return "";
    }
  };

}]);
