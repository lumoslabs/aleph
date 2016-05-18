!(angular => {
  'use strict';

  class QueryShowController {
    constructor($scope, QueryLoader, PageTitleManager, QueryTab, ResultRunner) {
      this._tabs = QueryTab;
      this._tabs.setActiveTabFromUrl();

      this.componentCallbacks = [];
      this._loader = QueryLoader;
      this._loader.initialize();
      this._loader.load().then(data => {
        PageTitleManager.title = data.query.title;
        PageTitleManager.onDestroy($scope);
        this.resultRunner = new ResultRunner(this.query, this.results, {
          enableAlert: true
        });
        _.each(this.componentCallbacks, callback => {
          callback(data);
        });
      });
    }

    get query() { return this._loader.query; }
    get queryVersions() { return this._loader.queryVersions; }
    get results() { return this._loader.results; }
    get queryId() { return this._loader.queryId; }
    get queryVersionId() { return this._loader.queryVersionId; }
    get tabs() { return this._tabs.state; }

    setTabInUrl(tab) {
      if(tab !== this._tabs.getTab()) {
        this._tabs.setTab(tab);
      }
    }
  }

  QueryShowController.$inject = ['$scope', 'QueryLoader', 'PageTitleManager', 'QueryTab', 'ResultRunner'];

  angular
    .module('alephControllers.queryShowController', ['alephServices'])
    .controller('QueryShowController', QueryShowController);
}(angular));
