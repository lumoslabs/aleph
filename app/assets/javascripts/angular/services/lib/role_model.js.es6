!(angular => {
  'use strict';

  class RoleModel {
    constructor($resource) {
      this.collection = [];
      this._resource = $resource('/roles.json');
    }

    initCollection() {
      return this._resource.query().$promise.then((roles) => {
        this.collection = roles;
        return roles;
      });
    }
  }

  RoleModel.$inject = ['$resource'];
  angular.module('alephServices.roleModel', []).service('RoleModel', RoleModel);

}(angular));
