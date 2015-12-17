app.controller('home:home', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){

  if($rootScope.user){
    $location.path('/messages');
    location.reload(); // <- hack to force the CSRF Token to hydrate
  }

}]);