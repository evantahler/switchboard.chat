app.controller('messageCommand:list', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
    $scope.messageCommands = [];
    $rootScope.actionHelper($scope, {}, '/api/messageCommand/list', 'GET', function(data){
      $scope.messageCommands = data.messageCommands;
    });
}]);
