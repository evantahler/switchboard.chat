app.controller('user:create', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
  $scope.formData    = {};
  $scope.processForm = function(){
    // $rootScope.actionHelper($scope, $scope.formData, '/api/user', 'POST', function(data){
    //   $rootScope.actionHelper($scope, $scope.formData, '/api/session', 'POST', function(data){
    //     if(data.user){ $rootScope.user = data.user; }
    //     $location.path('/dashboard');
    //   });
    // });
  };
}]);

app.controller('user:edit', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
  $scope.formData = $rootScope.user;

  $rootScope.actionHelper($scope, {userId: $rootScope.user.id}, '/api/user', 'GET', function(data){
    $scope.formData = data.user;
  });
    
  $scope.processForm = function(){
    delete $scope.success;
    $rootScope.actionHelper($scope, $scope.formData, '/api/user', 'PUT', function(data){
      if(data.user){ 
        $rootScope.user = data.user; 
        $scope.formData = data.user;
      }
      $scope.success = 'Updated!';
    });
  };
}]);
