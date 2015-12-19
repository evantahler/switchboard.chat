app.controller('pageController', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
  
  $scope.date = new Date();

  $rootScope.actionHelper($scope, {}, '/api/session', 'PUT', function(data){
    if(data.user){
      $rootScope.user      = data.user; 
      $rootScope.csrfToken = data.csrfToken; 

      if($location.path() === '/' || $location.path() === '/home'){
        $location.path('/messages');
      }
      
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
