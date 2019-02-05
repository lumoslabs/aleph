!(angular => {
  'use strict';

  class QueryDetailsController {
    constructor(QueryHandler, QueryTab, TagResource, defaultDateFormat, DefaultAceConfigurator, OpenReplService,
      RoleModel, Query) {
        this._handler = QueryHandler;
        this._repl = OpenReplService;
        this._tags = TagResource;
        this._roles = RoleModel;
        this._tabs = QueryTab;
        this.dateFormat = defaultDateFormat;
        this.aceLoaded = editor => new DefaultAceConfigurator(editor).readOnlyConfig();
        this._Query = Query;

        RoleModel.initCollection();
        this._closeCommentDialog();
    }

    openRepl() {
      this._repl.open( { query: this.query } )
        .then(this._handler.navigateToLatestVersion.bind(this._handler))
        .then(this._handler.success.bind(this._handler, 'update', false))
        .catch(this._handler.handleReplExit.bind(this._handler))
        .finally(this._closeCommentDialog.bind(this));
    }

    updateQuery() {
      this.query.save()
        .then(this._internalizeQueryItem.bind(this))
        .then(this._setPristine.bind(this))
        .then(this._handler.success.bind(this._handler, 'update', false))
        .finally(this._closeCommentDialog.bind(this));
    }

    runQuery() {
      this.resultRunner.run().then(this._tabs.navigateToTab.bind(this._tabs, 'results'));
    }

    cloneQuery() {
      let clone = this.query.clone();
      clone._item.title = "Copy of " + clone._item.title;

      clone.save()
        .then(this._internalizeQueryItem.bind(this))
        .then(this._handler.navigateToLatestVersion.bind(this._handler));
    }

    deleteQuery() {
      this.query.destroy().then(this._handler.navigateToIndex.bind(this._handler));
    }

    loadTags(searchTerm) {
      return this._tags.index({search: searchTerm}).$promise;
    }

    loadRoles() {
      return this._roles.collection;
    }

    toggleCommentDialog() {
      this.commentDialogOpen = !this.commentDialogOpen;
    }

    // private methods
    _closeCommentDialog() {
      this.commentDialogOpen = false;
    }

    _setPristine(query) {
      this.form.$setPristine();
      return query;
    }

    _internalizeQueryItem(queryItem) {
      let query = new this._Query;
      query.internalize(queryItem);
      return query;
    }
  }

  QueryDetailsController.$inject = ['QueryHandler', 'QueryTab', 'TagResource', 'defaultDateFormat',
    'DefaultAceConfigurator', 'OpenReplService', 'RoleModel', 'Query'];

  function queryDetailsComponent() {
    return {
      restrict: 'E',
      scope: {
        'resultRunner': '=',
        'query': '='
      },
      templateUrl: 'queryDetails',
      controller: 'QueryDetailsController',
      controllerAs: 'queryDetailsCtrl',
      bindToController: true
    };
  }

  angular
    .module('alephDirectives.queryDetails', ['alephServices'])
    .controller('QueryDetailsController', QueryDetailsController)
    .directive('queryDetails', queryDetailsComponent);
}(angular));
