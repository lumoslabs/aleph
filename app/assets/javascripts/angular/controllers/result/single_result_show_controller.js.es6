!(angular => {
  'use strict';

  class SingleResultShowController {
    constructor($routeParams, Query, Result, PageTitleManager) {
      this.resultId = $routeParams.resultId;
      this.queryId = $routeParams.queryId;
      this.queryVersionId = $routeParams.queryVersionId;

      this.query = new Query();
      this.query.initItem(this.queryId, this.queryVersionId).then(query => {
        this.pageTitle = 'Result ' + this.resultId + ' for ' + query.title;
        PageTitleManager.title = this.pageTitle;
      });

      this.result = new Result();
      this.result.initItem(this.resultId);
    }

    returnPath() {
      return '/queries/' + this.queryId + '/query_versions/' + this.queryVersionId;
    }
  }

  SingleResultShowController.$inject = ['$routeParams', 'Query', 'Result', 'PageTitleManager'];

  angular
    .module('alephControllers.singleResultShowController', ['alephServices'])
    .controller('SingleResultShowController', SingleResultShowController);
}(angular));
