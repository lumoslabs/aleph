!(angular => {
  'use strict';

  function SchemaColumnResource(ResourceFactory) {
    return ResourceFactory.make('/columns/:id.json', {id: '@id'});
  }

  SchemaColumnResource.$inject = ['ResourceFactory'];
  angular.module('alephServices.schema.columnResource', [])
    .service('SchemaColumnResource', SchemaColumnResource);

}(angular));
