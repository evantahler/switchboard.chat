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
    $rootScope.actionHelper($scope, $scope.formData, '/api/user/forgot-password', 'POST');
  };
}]);

app.controller('user:new-password', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
  $scope.formData    = {};
  $scope.processForm = function(){
    $scope.formData.userId = $rootScope.user.id;
    $scope.formData.requirePasswordChange = false;
    $rootScope.actionHelper($scope, $scope.formData, '/api/user', 'PUT', function(data){
      $location.path('/welcome');
      location.reload(); // <- hack to force the CSRF Token to hydrate
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

app.controller('user:list', ['$scope', '$rootScope', '$location', 'ngNotify', function($scope, $rootScope, $location, ngNotify){
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
        ngNotify.set('Team Member Deleted', 'success');
        loadTeamUsers();
      });
    }
  };
}]);

app.controller('user:edit', ['$scope', '$rootScope', '$location', 'ngNotify', function($scope, $rootScope, $location, ngNotify){
  $scope.formData = $rootScope.user;

  $rootScope.actionHelper($scope, {userId: $rootScope.user.id}, '/api/user', 'GET', function(data){
    $scope.formData = data.user;
  });

  $scope.processForm = function(){
    $scope.formData.userId = $rootScope.user.id;
    $rootScope.actionHelper($scope, $scope.formData, '/api/user', 'PUT', function(data){
      if(data.user){
        ngNotify.set('Account Updated', 'success');
        $rootScope.user = data.user;
        $scope.formData = data.user;
      }
    });
  };
}]);

app.controller('notification:edit', ['$scope', '$rootScope', '$location', 'ngNotify', function($scope, $rootScope, $location, ngNotify){
  $rootScope.actionHelper($scope, {userId: $rootScope.user.id}, '/api/notification', 'GET', function(data){
    $scope.formData = data.notification;
  });

  $scope.processForm = function(){
    $scope.formData.userId = $rootScope.user.id;
    $rootScope.actionHelper($scope, $scope.formData, '/api/notification', 'PUT', function(data){
      ngNotify.set('Notifications Updated', 'success');
      if(data.notification){
        $scope.formData = data.notification;
      }
    });
  };
}]);
