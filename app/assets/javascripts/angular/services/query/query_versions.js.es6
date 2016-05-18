!(angular => {
  'use strict';

  function QueryVersionsImports($resource, CollectionModelBase, UnpersistedModel) {

    return class QueryVersions extends CollectionModelBase {

      constructor() {
        super(
          { index: $resource('/queries/:id/query_versions/:query_version_id.json').query },
          UnpersistedModel
        );
      }

      initCollection(queryId) { return super.initCollection({id: queryId}); }
    };
  }

  QueryVersionsImports.$inject = ['$resource', 'CollectionModelBase', 'UnpersistedModel'];
  angular.module('alephServices.queryVersions', []).service('QueryVersions', QueryVersionsImports);
}(angular));
