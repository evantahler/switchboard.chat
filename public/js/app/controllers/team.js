app.controller('team:create', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
  $scope.formData    = {};
  $scope.processForm = function(){
    // TODO
  };
}]);

app.controller('team:edit', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
  $scope.formData = {};
  $scope.formatters = app.formatters;

  $rootScope.actionHelper($scope, {
    userId: $rootScope.user.id, teamId: $rootScope.user.teamId
  }, '/api/team', 'GET', function(data){
    data.team.phoneNumber = $scope.formatters.phoneNumber(data.team.phoneNumber);
    $scope.formData = data.team;
  });
    
  $scope.processForm = function(){
    delete $scope.success;
    $rootScope.actionHelper($scope, $scope.formData, '/api/team', 'PUT', function(data){
      $scope.success = 'Updated!';
      $rootScope.team = data.team;
    });
  };
}]);
