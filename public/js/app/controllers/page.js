app.controller('pageController', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){

  $scope.date = new Date();

  $rootScope.actionHelper($scope, {}, '/api/session', 'PUT', function(data){
    if(data.user){
      $rootScope.user      = data.user;
      $rootScope.csrfToken = data.csrfToken;

      if($rootScope.user.requirePasswordChange){ $location.path('/new-password'); }
      if(!$rootScope.user.requirePasswordChange && $location.path() === '/new-password'){ $location.path('/people'); }
      if($location.path() === '/'){      $location.path('/people'); }
      if($location.path() === '/login'){ $location.path('/people'); }

      $rootScope.actionHelper($scope, {}, '/api/team', 'GET', function(data){
        if(data.team){ $rootScope.team = data.team;  }
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

  $rootScope.actionHelper($scope, {}, '/api/billing/rates', 'GET', function(data){
    $rootScope.billing.rates = data.billing.rates;
    Stripe.setPublishableKey(data.billing.stripe.PublishableKey);
  });

  $scope.getNavigationHighlight = function(path){
    var parts = $location.path().split('/');
    parts.shift();
    var simplePath = parts[0];
    if(simplePath == path){
      return "active";
    }else{
      return "";
    }
  };

}]);
