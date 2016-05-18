!(angular => {
  'use strict';

  function SchemaCommentResource(ResourceFactory) {
    return ResourceFactory.make('/schema_comments/:id.json', {id: '@id'});
  }

  SchemaCommentResource.$inject = ['ResourceFactory'];
  angular.module('alephServices.schema.commentResource', [])
    .service('SchemaCommentResource', SchemaCommentResource);

}(angular));
