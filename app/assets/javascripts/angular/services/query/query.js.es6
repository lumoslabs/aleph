!(angular => {
  'use strict';

  function QueryModelImports(QueryResource, ParameterMethods, StandardModel, TagsAndRolesComparator, $q) {

    return class Query extends StandardModel {

      constructor() {
        super(
          'query',
          QueryResource,
          {
            title: '',
            tags: [],
            roles: [],
            version: {
              body: '',
              comment: '',
              parameters: []
            },
            scheduled_flag: false,
            email: ''
          },
          [
            'title',
            'version.body',
            'version.comment',
            'roles',
            'tags',
            'scheduled_flag',
            'email'
          ],
          {
            tags: ((l, r) => TagsAndRolesComparator.compare(l, r)),
            roles: ((l, r) => TagsAndRolesComparator.compare(l, r))
          }
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

  QueryModelImports.$inject = ['QueryResource', 'ParameterMethods', 'StandardModel', 'TagsAndRolesComparator', '$q'];
  angular.module('alephServices.query', []).service('Query', QueryModelImports);

}(angular));
