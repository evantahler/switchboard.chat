app.controller('user:create', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
  $scope.formData    = {};
  $scope.processForm = function(){
    $scope.formData.teamId = $rootScope.team.id;
    $rootScope.actionHelper($scope, $scope.formData, '/api/user', 'POST', function(data){
      location.reload();
    });
  };
}]);

app.controller('user:forgot-password', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
  $scope.formData    = {};
  $scope.processForm = function(){
    $rootScope.actionHelper($scope, $scope.formData, '/api/user/forgot-password', 'POST', function(data){
      $scope.success = data.message;
    });
  };
}]);

app.controller('user:new-password', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
  $scope.formData    = {};
  $scope.processForm = function(){
    $scope.formData.userId = $rootScope.user.id;
    $scope.formData.requirePasswordChange = false;
    $rootScope.actionHelper($scope, $scope.formData, '/api/user', 'PUT', function(data){
      location.reload();
    });
  };
}]);

app.controller('user:reset-password', ['$scope', '$rootScope', '$location', '$routeParams', function($scope, $rootScope, $location, $routeParams){
  $scope.formData    = {};
  $scope.processForm = function(){
    $scope.formData.userId              = $routeParams.userId;
    $scope.formData.passwordResetToken  = $routeParams.token;
    $rootScope.actionHelper($scope, $scope.formData, '/api/user/reset-password', 'POST', function(data){
      window.location = '/#/login';
    });
  };
}]);

app.controller('user:list', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
  var loadTeamUsers = function(){
    $rootScope.actionHelper($scope, {}, '/api/user/list', 'GET', function(data){
      $scope.users = data.users;
    });
  };

  loadTeamUsers();

  $scope.deleteTeamUser = function(userId){
    if(confirm('Are you sure?')){
      $rootScope.actionHelper($scope, {
        userId: userId,
        teamId: $rootScope.team.id,
      }, '/api/user', 'DELETE', function(data){
        loadTeamUsers();
      }, function(e){
        alert(e);
      });
    }
  };
}]);

app.controller('user:edit', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
  $scope.formData = $rootScope.user;

  $rootScope.actionHelper($scope, {userId: $rootScope.user.id}, '/api/user', 'GET', function(data){
    $scope.formData = data.user;
  });
    
  $scope.processForm = function(){
    delete $scope.success;
    $scope.formData.userId = $rootScope.user.id;
    $rootScope.actionHelper($scope, $scope.formData, '/api/user', 'PUT', function(data){
      if(data.user){ 
        $rootScope.user = data.user; 
        $scope.formData = data.user;
      }
      $scope.success = 'Updated!';
    });
  };
}]);

app.controller('notification:edit', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
  $rootScope.actionHelper($scope, {userId: $rootScope.user.id}, '/api/notification', 'GET', function(data){
    $scope.formData = data.notification;
  });
    
  $scope.processForm = function(){
    delete $scope.success;
    $scope.formData.userId = $rootScope.user.id;
    $rootScope.actionHelper($scope, $scope.formData, '/api/notification', 'PUT', function(data){
      if(data.notification){ 
        $scope.formData = data.notification; 
      }
      $scope.success = 'Updated!';
    });
  };
}]);
