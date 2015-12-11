app.controller('message:create', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
  $scope.formData    = {};
  $scope.processForm = function(){
    $rootScope.actionHelper($scope, $scope.formData, '/api/sms/out', 'POST', function(data){
      location.reload();
    });
  };
}]);

app.controller('messages:list', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
  $scope.loadMessages = function(){
    $rootScope.actionHelper($scope, {}, '/api/sms/list', 'GET', function(data){
      $scope.messages = data.messages;
    }, function(error){ alert(error); });
  };

  $scope.loadMessages();
}]);