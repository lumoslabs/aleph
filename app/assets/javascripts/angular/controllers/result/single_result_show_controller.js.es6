!(angular => {
  'use strict';

  class SingleResultShowController {
    constructor($routeParams, Result) {
      this.resultId = $routeParams.resultId;
      this.result = new Result();
      this.result.initItem(this.resultId);
    }
  }

  SingleResultShowController.$inject = ['$routeParams', 'Result'];

  angular
    .module('alephControllers.singleResultShowController', ['alephServices'])
    .controller('SingleResultShowController', SingleResultShowController);
}(angular));
