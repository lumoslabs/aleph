!(angular => {
  'use strict';

  function AlertResource(ResourceFactory) {
    return ResourceFactory.make('/alerts/:id.json', {id: '@id'});
  }

  AlertResource.$inject = ['ResourceFactory'];
  angular.module('alephServices.alertResource', []).service('AlertResource', AlertResource);
}(angular));
