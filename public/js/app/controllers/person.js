app.controller('person:combined', ['$scope', '$rootScope', '$location', 'ngNotify', function($scope, $rootScope, $location, ngNotify){

  $scope.person = null;
  $scope.people = [];
  $scope.folders = [];
  $scope.messages = [];
  $scope.client = null;
  $scope.groupMessageStatus = [0,0];
  $scope.totalMessages = null;
  $scope.showPagination = true;
  $scope.paginationData = {
    limit: '50', page: '1', possiblePages: [], folderId: '',
  };
  $scope.forms = {
    createPerson: {},
    createFolder: {},
    editPerson: {},
    editFolder: {},
    message: {},
    groupMessage: {},
  };

  ///////////
  // FORMS //
  ///////////

  $scope.processCreatePersonForm = function(){
    $scope.forms.createPerson.teamId = $rootScope.user.teamId;
    if($scope.folders.length === 1 && !$scope.forms.createPerson.folderId){
      $scope.forms.createPerson.folderId = $scope.folders[0].id;
    }
    $rootScope.authenticatedActionHelper($scope, $scope.forms.createPerson, '/api/person', 'POST', function(data){
      $scope.clearModals('#addPersonModal');
      $scope.forms.createPerson = {};
      $scope.loadPeople();
      ngNotify.set('Person Added', 'success');
    });
  };

  $scope.processCreateFolderForm = function(){
    $scope.forms.createFolder.teamId = $rootScope.user.teamId;
    $rootScope.authenticatedActionHelper($scope, $scope.forms.createFolder, '/api/folder', 'POST', function(data){
      $scope.clearModals('#addFolderModal');
      $scope.forms.createFolder = {};
      $scope.loadFolders();
      ngNotify.set('Folder Added', 'success');
    });
  };

  $scope.processEditPersonForm = function(){
    $scope.forms.editPerson.personId = $scope.forms.editPerson.id;
    $rootScope.authenticatedActionHelper($scope, $scope.forms.editPerson, '/api/person', 'PUT', function(data){
      $scope.clearModals('#editPersonModal');
      $scope.forms.editPerson = {};
      $scope.loadPeople();
      if($scope.person){ $scope.loadPerson($scope.person.id); }
      ngNotify.set('Person Updated', 'success');
    });
  };

  $scope.processEditFolderForm = function(){
    $scope.forms.editFolder.folderId = $scope.forms.editFolder.id;
    $rootScope.authenticatedActionHelper($scope, $scope.forms.editFolder, '/api/folder', 'PUT', function(data){
      $scope.clearModals('#editFolderModal');
      $scope.forms.editFolder = {};
      $scope.loadFolders();
      ngNotify.set('Folder Updated', 'success');
    });
  };

  $scope.processMessageForm = function(){
    $scope.forms.message.personId = $scope.person.id;
    $rootScope.authenticatedActionHelper($scope, $scope.forms.message, '/api/message/out', 'POST', function(data){
      $scope.forms.message = {};
    });
  };

  $scope.processGroupMessageForm = function(personIds){
    if(!personIds){
      $scope.groupMessageStatus = [0,0];
      personIds = [];

      try{
        personIds = $scope.forms.groupMessage.personIds.slice();
      }catch(e){}

      if(personIds.length === 0){
        $scope.error = 'chose at least one team member to send a message to';
        return;
      }

      $scope.groupMessageStatus = [0, personIds.length];
    }

    if(personIds.length === 0){
      $scope.forms.groupMessage.body = null;

      return setTimeout(function(){
        $scope.groupMessageStatus = [0,0];
        $scope.clearModals('#groupMessageModal');
      }, 1000);
    }

    $rootScope.authenticatedActionHelper($scope, {
      personId: personIds.pop(),
      body: $scope.forms.groupMessage.body
    }, '/api/message/out', 'POST', function(){
      $scope.groupMessageStatus[0]++;
      $scope.processGroupMessageForm(personIds);
    });
  };

  ////////////////
  // UI HELPERS //
  ////////////////

  $scope.clearModals = function(name){
    $(name).modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  };

  $scope.loadPeople = function(){
    $rootScope.authenticatedActionHelper($scope, {}, '/api/person/list', 'GET', function(data){
      if(data.people){
        $scope.people = data.people;

        if($location.path() === '/messages'){
          $scope.people.forEach(function(person){
            $scope.checkUnreadCount(person.id);
          });
        }
      }
    });
  };

  $scope.loadFolders = function(){
    $rootScope.authenticatedActionHelper($scope, {}, '/api/folder/list', 'GET', function(data){
      $scope.folders = data.folders;
    });
  };

  $scope.editPerson = function(personId){
    $scope.forms.editPerson = {};
    $('#editPersonModal').modal('show');
    $rootScope.authenticatedActionHelper($scope, {personId: personId}, '/api/person', 'GET', function(data){
      $scope.forms.editPerson = data.person;
      $scope.forms.editPerson.folderId = String($scope.forms.editPerson.folderId);
    });
  };

  $scope.editFolder= function(folderId){
    $scope.forms.editFolder = {};
    $('#editFolderModal').modal('show');
    $rootScope.authenticatedActionHelper($scope, {folderId: folderId}, '/api/folder', 'GET', function(data){
      $scope.forms.editFolder = data.folder;
    });
  };

  $scope.deletePerson = function(personId){
    if(confirm('Are you sure?')){
      $scope.clearModals('#editPersonModal');
      $rootScope.authenticatedActionHelper($scope, {
        personId: personId,
        teamId: $rootScope.team.id,
      }, '/api/person', 'DELETE', function(data){
        ngNotify.set('Person Deleted', 'success');
        $scope.loadPeople();
      });
    }
  };

  $scope.deleteFolder = function(folderId){
    if(confirm('Are you sure?')){
      $scope.clearModals('#editPersonModal');
      $rootScope.authenticatedActionHelper($scope, {
        folderId: folderId,
        teamId: $rootScope.team.id,
      }, '/api/folder', 'DELETE', function(data){
        ngNotify.set('Folder Deleted', 'success');
        $scope.loadFolders();
      });
    }
  };

  $scope.checkUnreadCount = function(personId){
    $rootScope.authenticatedActionHelper($scope, {
      personId: personId,
      teamId: $rootScope.team.id,
    }, '/api/person/unread', 'GET', function(data){
      if(data.unreadCount > 0){
        $scope.blinkPerson(data.person.phoneNumber);
      }
    });
  };

  $scope.loadThread = function(personId){
    $scope.loadPerson(personId);
    for(var i in $scope.people){
      if(personId === $scope.people[i].id){
        $scope.people[i].alert = false;
        break;
      }
    }
  };

  $scope.blinkPerson = function(to, from){
    for(var i in $scope.people){
      var person = $scope.people[i];
      if(person.phoneNumber === to || person.phoneNumber === from){
        person.alert = true;
        break;
      }
    }
  };

  $scope.loadPerson = function(personId){
    $rootScope.authenticatedActionHelper($scope, {personId: personId}, '/api/person', 'GET', function(data){
      $scope.person = data.person;
      $scope.loadMessages();
    });
  };

  $scope.loadMessages = function(){
    if($scope.person){
      $scope.totalMessages = null;
      $scope.messages = [];

      var offset = ($scope.paginationData.page - 1) * $scope.paginationData.limit;

      $rootScope.authenticatedActionHelper($scope, {
        limit: $scope.paginationData.limit,
        offset: offset,
        personIds: [ $scope.person.id ],
      }, '/api/message/list', 'GET', function(data){
        $scope.messages = data.messages;
        $scope.totalMessages = data.total;
        $scope.paginationData.page  = String((data.offset / data.limit) + 1);
        $scope.paginationData.limit = String(data.limit);
        $scope.paginationData.possiblePages = [];

        var counter = 0;
        while((counter * $scope.paginationData.limit) < data.total){
          $scope.paginationData.possiblePages.push((counter + 1));
          counter++;
        }
      });
    }
  };

  ///////////////
  // WEBSOCKET //
  ///////////////

  $scope.connectWS = function(){
    if(!$scope.client){

      $scope.client = new ActionheroClient();

      $scope.client.on('connected',    function(){    console.log('connected!');       });
      $scope.client.on('error',        function(err){ console.log('error', err.stack); });
      $scope.client.on('reconnect',    function(){    console.log('reconnect');        });
      $scope.client.on('reconnecting', function(){    console.log('reconnecting');     });

      $scope.client.on('say', function(payload){
        if(payload.message.direction === 'in'){ $rootScope.audio[1].play(); }
        if(payload.message.direction === 'out'){ $rootScope.audio[2].play(); }
        $scope.client.action('message:read', {messageId: payload.message.id});
        if(
          $scope.person && (
            String(payload.message.to) === String($scope.person.phoneNumber) ||
            String(payload.message.from) === String($scope.person.phoneNumber)
          )
        ){
          $scope.messages.unshift(payload.message);
        }

        else{
          $scope.blinkPerson(payload.message.to, payload.message.from);
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
    }
  };

  ////////////
  // EVENTS //
  ////////////

  $scope.$watch('paginationData.limit',  $scope.loadMessages);
  $scope.$watch('paginationData.page' ,  $scope.loadMessages);
  $scope.$watch('paginationData.folderId' , function(){
    $scope.paginationData.folderIdAsInt = parseInt($scope.paginationData.folderId);
  });

  //////////
  // INIT //
  //////////

  if($location.path() === '/messages'){
    $scope.loadFolders();
    $scope.loadPeople();
    $scope.connectWS();
  }

  if($location.path() === '/address-book'){
    $scope.loadFolders();
    $scope.loadPeople();
  }
}]);
