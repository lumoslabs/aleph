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
        this._closeDialogBoxes();
    }

    openRepl() {
      this._repl.open( { query: this.query } )
        .then(this._handler.navigateToLatestVersion.bind(this._handler))
        .then(this._handler.success.bind(this._handler, 'update', false))
        .catch(this._handler.handleReplExit.bind(this._handler))
        .finally(this._closeCommentDialog.bind(this));
    }

    updateTitle() {
      if(this.query.isDirty()) {
        this._updateQuery()
          .then(this._setPristine.bind(this))
          .finally(this._closeDialogBoxes.bind(this));
      }
    }

    updateTagsAndRoles() {
      if(this.query.isDirty()) {
        this._updateQuery().finally(this._closeDialogBoxes.bind(this));
      }
    }

    updateCommentDialogAndClose() {
      if(this.query.isDirty()) {
        this._updateQuery().finally(this._closeCommentDialog.bind(this));
      } else {
        this._closeCommentDialog();
      }
    }

    updateScheduleDialogAndClose() {
      if(this.query.isDirty()) {
        this._updateQuery().finally(this._closeScheduleDialog.bind(this));
      } else {
        this._closeScheduleDialog();
      }
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
      if(this.commentDialogOpen == true) {
        this._closeScheduleDialog();
      }
    }

    toggleScheduleDialog() {
      this.scheduleDialogOpen = !this.scheduleDialogOpen;
      if(this.scheduleDialogOpen == true) {
        this._closeCommentDialog();
      }
    }

    // private methods
    _updateQuery() {
      return this.query.save()
      .then(this._internalizeQueryItem.bind(this))
      .then(this._handler.success.bind(this._handler, 'update', false));
    }

    _closeDialogBoxes() {
      this._closeScheduleDialog();
      this._closeCommentDialog();
    }

    _closeCommentDialog() {
      this.commentDialogOpen = false;
    }

    _closeScheduleDialog() {
      this.scheduleDialogOpen = false;
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
