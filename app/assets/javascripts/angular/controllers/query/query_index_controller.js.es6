!(angular => {
  'use strict';

  class QueryIndexController {

    constructor(QueryResource, Query, QueryHandler, defaultDateFormat, OpenReplService, PaginationComponents,
      TagResource, RoleModel, SelectionTagInput, $q) {
        this.selectedQueries = [];
        this.defaultDateFormat = defaultDateFormat;
        this._handler = QueryHandler;

        this.tagsSelectionInput = new SelectionTagInput({
          items: this.selectedQueries,
          itemField: 'tags'
        });

        this.rolesSelectionInput = new SelectionTagInput({
          items: this.selectedQueries,
          itemField: 'roles'
        });

        this.pagination = new PaginationComponents('Paginated Queries', QueryResource.index, Query);

        this._roleModel = RoleModel;
        this._tagResource = TagResource;
        this._$q = $q;
        this._repl = OpenReplService;

        RoleModel.initCollection();
    }

    loadTags(searchTerm) {
      return this._tagResource.index({search: searchTerm}).$promise;
    }

    loadRoles() {
      return this._roleModel.collection;
    }

    onSelection() {
      this.tagsSelectionInput.onSelection();
      this.rolesSelectionInput.onSelection();
    }

    deselectAll() {
      _.each(this.selectedQueries, query => { query.selected = false; });
      this.selectedQueries.length = 0;
      this.onSelection();
    }

    save() {
      this.pagination.save().then(() => {
        this.deselectAll();
        this.pagination.reload();
      });
    }

    revert() {
      this.pagination.revert();
      this.onSelection();
    }

    openRepl() {
      this._repl.open()
        .then(this._handler.navigateToLatestVersion.bind(this._handler))
        .then(this._handler.success.bind(this._handler, 'create', true))
        .catch(this._handler.handleReplExit.bind(this._handler));
    }
  }

  QueryIndexController.$inject = ['QueryResource', 'Query', 'QueryHandler', 'defaultDateFormat', 'OpenReplService',
  'PaginationComponents', 'TagResource', 'RoleModel', 'SelectionTagInput', '$q'];

  angular
    .module('alephControllers.queryIndexController', ['alephServices'])
    .controller('QueryIndexController', QueryIndexController);
}(angular));
