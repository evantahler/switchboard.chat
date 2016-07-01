app.controller('session:create', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
  $scope.formData    = {};

  if($rootScope.user){
    if($rootScope.user.requirePasswordChange){
      $location.path('/new-password');
    }else{
      $location.path('/messages');
    }
  }

  $scope.processForm = function(){
    $rootScope.actionHelper($scope, $scope.formData, '/api/session', 'POST', function(data){
      if(data.user){
        $rootScope.user = data.user;
        location.reload(); // <- hack to force the CSRF Token to hydrate
      }else if(data.error){
        ngNotify.set(data.error, 'error');
      }else{
        location.reload();
      }
    });
  };
}]);

app.controller('session:destroy', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
  $scope.submitForm = function(){
    $scope.processForm.call(this);
  };

  $scope.processForm = function(){
    $rootScope.actionHelper($scope, {}, '/api/session', 'DELETE', function(data){
      delete $rootScope.user;
      $location.path('/');
      setTimeout(window.location.reload, 500); // to ensure that any WS connections are terminated.
    });
  };
}]);
