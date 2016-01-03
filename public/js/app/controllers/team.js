app.controller('team:create', ['$scope', '$rootScope', '$location', 'ngNotify', function($scope, $rootScope, $location, ngNotify){

  if($rootScope.user){
    $location.path('/welcome');
    location.reload(); // <- hack to force the CSRF Token to hydrate
  }

  $scope.formData    = {};

  var processCard = function(callback){
    Stripe.card.createToken({
      number: $scope.formData.cardNumber,
      cvc: $scope.formData.cvc,
      exp_month: $scope.formData.expMonth,
      exp_year: $scope.formData.expYear
    }, function(status, response){
      if(response.error){
        ngNotify.set(response.error.message, 'error');
      }else{
        $scope.formData.stripeToken = response.id;
        callback();
      }
    });
  };

  var processApi = function(){
    $rootScope.actionHelper($scope, $scope.formData, '/api/team', 'POST', function(data){
      $rootScope.actionHelper($scope, $scope.formData, '/api/session', 'POST', function(data){
        if(data.user){
          $rootScope.user = data.user;
          location.reload();
        }
      });
    });
  };

  $scope.processForm = function(){
    processCard(processApi);
  };
}]);

app.controller('team:edit', ['$scope', '$rootScope', '$location', 'ngNotify', function($scope, $rootScope, $location, ngNotify){
  $scope.formData = {};

  $rootScope.actionHelper($scope, {
    userId: $rootScope.user.id, teamId: $rootScope.user.teamId
  }, '/api/team', 'GET', function(data){
    data.team.phoneNumber = $rootScope.formatters.phoneNumber(data.team.phoneNumber);
    $scope.formData = data.team;
  });

  $scope.processForm = function(){
    $rootScope.actionHelper($scope, $scope.formData, '/api/team', 'PUT', function(data){
      ngNotify.set('Updated', 'success');
      $rootScope.team = data.team;
    });
  };
}]);
