app.controller('message:create', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
  $scope.formData    = {};
  $scope.processForm = function(){
    $rootScope.actionHelper($scope, $scope.formData, '/api/message/out', 'POST', function(data){
      $scope.formData.body = '';
    });
  };
}]);

app.controller('messages:list', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
  $scope.formatters = app.formatters;

  $scope.loadMessages = function(){
    $rootScope.actionHelper($scope, {}, '/api/message/list', 'GET', function(data){
      $scope.messages = data.messages;
    }, function(error){ alert(error); });
  };

  ///////////////
  // WEBSOCKET //
  ///////////////

  $scope.client = new ActionheroClient;

  $scope.client.on('connected',    function(){    console.log('connected!');       });
  $scope.client.on('error',        function(err){ console.log('error', err.stack); });
  $scope.client.on('reconnect',    function(){    console.log('reconnect');        });
  $scope.client.on('reconnecting', function(){    console.log('reconnecting');     });
  
  $scope.client.on('say', function(payload){
    $scope.messages.unshift(payload.message);
    $rootScope.$apply();
  });

  $scope.client.connect(function(err, details){
    if(err){ return console.log(err); }
    $scope.client.action('session:wsAuthenticate', {}, function(data){
      if(data.error){ return console.log(error); }
      $scope.client.roomAdd('team:' + $rootScope.user.teamId);
    });
  });

  $scope.$on('$locationChangeStart', function(event){
    $scope.client.disconnect();
  });

  $scope.loadMessages();
}]);