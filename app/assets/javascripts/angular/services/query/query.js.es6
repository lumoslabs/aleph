!(angular => {
  'use strict';

  function QueryModelImports(QueryResource, ParameterMethods, StandardModel, $q) {

    return class Query extends StandardModel {

      constructor() {
        super(
          'query',
          QueryResource,
          {
            title: '',
            tags: [],
            version: {
              body: '',
              parameters: []
            },
            set_latest_result: false
          },
          [
            'title',
            'version.body',
            'roles',
            'tags',
            'set_latest_result'
          ]
        );
      }

      initItem(queryId, queryVersionId) {
        if (queryId && queryVersionId) {
          return super.fetch({
            id: queryId,
            version_id: queryVersionId
          });
        } else {
          this.item = this._newItem();
          return $q.when(this.item);
        }
      }

      detectParameters() {
        ParameterMethods.detectParameters(this.item.version.body, this.item.version.parameters);
      }

      addParameter(name) {
        let parameter = ParameterMethods.constructParameter(name);
        this.item.version.parameters.push(parameter);
      }
    };
  }

  QueryModelImports.$inject = ['QueryResource', 'ParameterMethods', 'StandardModel', '$q'];
  angular.module('alephServices.query', []).service('Query', QueryModelImports);

}(angular));
