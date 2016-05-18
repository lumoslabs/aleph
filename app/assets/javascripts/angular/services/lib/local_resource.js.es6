!(angular => {
  'use strict';

  function LocalResourceImports($http) {

    return class LocalResource {

      constructor(...paths) {
        this.path = ['resources'].concat(paths);
      }

      get(resource) {
        return $http.get(this.path.concat([resource]).join('/'));
      }
    };
  }

  LocalResourceImports.$inject = ['$http'];
  angular.module('alephServices.localResource', []).service('LocalResource', LocalResourceImports);
}(angular));
