exports.folderCreate = {
  name:                   'folder:create',
  description:            'folder:create',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {
    name:   { required: true },
  },

  run: function(api, data, next){
    var folder = api.models.folder.build({
      name: data.params.name,
      teamId: data.session.teamId,
    });

    folder.save().then(function(){
      data.response.folder = folder.apiData(api);
      next();
    }).catch(function(errors){
      next(errors.errors[0].message);
    });
  }
};

exports.folderView = {
  name:                   'folder:view',
  description:            'folder:view',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {
    folderId: { required: true },
  },

  run: function(api, data, next){
    api.models.folder.findOne({where: {
      teamId: data.session.teamId,
      id: data.params.folderId,
    }}).then(function(folder){
      data.response.folder = folder.apiData(api);
      next();
    }).catch(next);
  }
};

exports.folderEdit = {
  name:                   'folder:edit',
  description:            'folder:edit',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {
    folderId: { required: true },
    name:     { required: true },
  },

  run: function(api, data, next){
    api.models.folder.findOne({where: {
      teamId: data.session.teamId,
      id: data.params.folderId,
    }}).then(function(folder){
      folder.name = data.params.name;
      folder.save().then(function(){
        data.response.folder = folder.apiData(api);
        next();
      }).catch(next);
    }).catch(next);
  }
};

exports.folderList = {
  name:                   'folder:list',
  description:            'folder:list',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {},

  run: function(api, data, next){
    api.models.folder.findAll({where: {
      teamId: data.session.teamId,
    }}).then(function(folders){
      data.response.folders = [];
      folders.forEach(function(folder){
        data.response.folders.push( folder.apiData(api) );
      });
      next();
    }).catch(next);
  }
};

exports.folderDestroy = {
  name:                   'folder:destroy',
  description:            'folder:destroy',
  outputExample:          {},
  middleware:             [ 'logged-in-session' ],

  inputs: {
    folderId: { required: true },
  },

  run: function(api, data, next){
    api.models.folder.findOne({where: {
      teamId: data.session.teamId,
      id: data.params.folderId,
    }}).then(function(folder){
      api.models.person.count({where: {
        teamId: data.session.teamId,
        folderId: folder.id
      }}).then(function(count){
        if(count && count > 0){
          next(new Error('you must empty this folder first'));
        }else{
          folder.destroy().then(function(){
            next();
          }).catch(next);
        }
      }).catch(next);
    }).catch(next);
  }
};
