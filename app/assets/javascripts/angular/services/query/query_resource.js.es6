!(angular => {
  'use strict';

  function QueryResource(ResourceFactory, QueryRequestTransformers) {
    return ResourceFactory.make('/queries/:id.json', {id: '@id'},
      {
        update: {
          method: 'PUT',
          transformRequest: QueryRequestTransformers
        },
        create: {
          method: 'POST',
          transformRequest: QueryRequestTransformers
        }
      }
    );
  }

  QueryResource.$inject = ['ResourceFactory', 'QueryRequestTransformers'];
  angular.module('alephServices.queryResource', []).service('QueryResource', QueryResource);
}(angular));
