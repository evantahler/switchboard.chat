app.controller('person:create', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
  $scope.formData    = {};
  $scope.processForm = function(){
    $scope.formData.teamId = $rootScope.user.teamId;
    $rootScope.actionHelper($scope, $scope.formData, '/api/person', 'POST', function(data){
      $('#addPersonModal').modal('hide');
      $scope.formData = {};
      $rootScope.actionHelper($scope, {}, '/api/person/list', 'GET', function(data){
        if(data.people){ $rootScope.people = data.people;  }
      });

    });
  };
}]);

app.controller('person:list', ['$scope', '$rootScope', function($scope, $rootScope){
  $scope.selectedPersonId = null;
  $scope.loadThread = function(personId){
    $scope.selectedPersonId = personId;
    for(var i in $rootScope.people){
      var person = $rootScope.people[i];
      if(person.id === personId){
        person.alert = false;
        break;
      }
    }
    $rootScope.$broadcast('loadThread', personId);
  };

  $rootScope.$on('blinkPerson', function(event, payload){
    var to   = payload[0];
    var from = payload[1];
    for(var i in $rootScope.people){
      var person = $rootScope.people[i];
      if(person.phoneNumber === to || person.phoneNumber === from){
        person.alert = true;
        break;
      }
    }      
  });
}]);

app.controller('person:thread', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location){
  $scope.person = null;
  $scope.messages = [];
  $scope.formData = {};

  $rootScope.$on('loadThread', function(event, personId){
    $scope.messages = [];

    $rootScope.actionHelper($scope, {personId: personId}, '/api/person', 'GET', function(data){
      $scope.person = data.person;
    });

    $rootScope.actionHelper($scope, {personId: personId}, '/api/message/list', 'GET', function(data){
      $scope.messages = data.messages;
    });
  });

  $scope.processForm = function(){
    $scope.formData.to = $scope.person.phoneNumber;
    $rootScope.actionHelper($scope, $scope.formData, '/api/message/out', 'POST', function(data){
      $scope.formData.body = '';
      $('#sendMessageModal').modal('hide');
    });
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
    if(payload.message.direction === 'in'){ $rootScope.audio[1].play(); }
    if(payload.message.direction === 'out'){ $rootScope.audio[2].play(); }

    if(
      $scope.person && (
        String(payload.message.to) === String($scope.person.phoneNumber) || 
        String(payload.message.from) === String($scope.person.phoneNumber)
      )
    ){
      $scope.messages.unshift(payload.message);
    }

    else{
      $rootScope.$broadcast('blinkPerson', [payload.message.to, payload.message.from]);
    }

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
}]);