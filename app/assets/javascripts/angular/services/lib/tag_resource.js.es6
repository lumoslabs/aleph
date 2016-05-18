(angular => {
  'use strict';

  angular.module('alephServices.tagResource', [])

  .factory('TagResource', ['$resource',
    function ($resource) {
      return $resource('/tags/:id.json', {id: '@id'}, {
        index:   { method: 'GET', isArray: true, responseType: 'json'},
      });
    }
  ]);

}(angular));
