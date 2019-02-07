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
            latest_result_s3_url_flag: false,
            scheduled_flag: false,
            email: ''
          },
          [
            'title',
            'version.body',
            'roles',
            'tags',
            'latest_result_s3_url_flag',
            'scheduled_flag',
            'email'
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
