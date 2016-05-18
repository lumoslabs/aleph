!(angular => {
  'use strict';

  class ResourceFactory {

    constructor($resource) {
      this._defaultActions = {
        update: {
          method: 'PUT'
        },
        create: {
          method: 'POST'
        },
        show: {
          method: 'GET'
        },
        index:  {
          method: 'GET',
          isArray: true,
          responseType: 'json'
        },
        destroy: {
          method: 'DELETE'
        }
      };

      this._$resource = $resource;
    }

    make(path, parameters, actions = {}) {
      return this._$resource(path, parameters, _.merge(this._defaultActions, actions));
    }
  }

  ResourceFactory.$inject = ['$resource'];
  angular.module('modelGeneration.resourceFactory', []).service('ResourceFactory', ResourceFactory);

}(angular));
