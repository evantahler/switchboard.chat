/////////////
// HELPERS //
/////////////

var routes = [
  // ROUTE         PAGE PARTIAL                   PAGE TITLE                    REQUIRE LOGIN
  [ '/',           'pages/home.html',             'switchboard.chat',             false ],
  [ '/home',       'pages/home.html',             'switchboard.chat',             false ],
  [ '/about',      'pages/about.html',            'switchboard.chat: About',      false ],
  [ '/login',      'pages/session/create.html',   'switchboard.chat: Log In',     false ],
  [ '/logout',     'pages/session/destroy.html',  'switchboard.chat: Log Out',    false ],
  [ '/messages',   'pages/messages.html',         'switchboard.chat: Messages',   true  ],
  [ '/users',      'pages/users.html',            'switchboard.chat: Users',      true  ],
  [ '/settings',   'pages/settings.html',         'switchboard.chat: Settings',   true  ],
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
  $rootScope.routes = routes;

  $rootScope.actionHelper = function($scope, data, path, verb, successCallback, errorCallback){
    var i;
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
    }).catch(function(data){
      var errorMessage = '';
      if(data.data && data.data.error){
        errorMessage = data.data.error;
      }else{
        errorMessage = data.statusText + ' | ' + data.status;
      }
      errorCallback(errorMessage);
    });
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
    }
  }, function(error){
    var matchedAndOK = false;
    var path = $location.path();

    if(path.indexOf('/r/') === 0){
      matchedAndOK = true;
    }

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

app.filter('tel', function () {
  return function (tel) {
    if (!tel) { return ''; }

    var value = tel.toString().trim().replace(/^\+/, '');

    if (value.match(/[^0-9]/)) {
        return tel;
    }

    var country, city, number;

    switch (value.length) {
        case 10: // +1PPP####### -> C (PPP) ###-####
            country = 1;
            city = value.slice(0, 3);
            number = value.slice(3);
            break;

        case 11: // +CPPP####### -> CCC (PP) ###-####
            country = value[0];
            city = value.slice(1, 4);
            number = value.slice(4);
            break;

        case 12: // +CCCPP####### -> CCC (PP) ###-####
            country = value.slice(0, 3);
            city = value.slice(3, 5);
            number = value.slice(5);
            break;

        default:
            return tel;
    }

    if (country == 1) {
        country = "";
    }

    number = number.slice(0, 3) + '-' + number.slice(3);

    return (country + " (" + city + ") " + number).trim();
  };
});

