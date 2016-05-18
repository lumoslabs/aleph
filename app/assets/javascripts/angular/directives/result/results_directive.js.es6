!(angular => {
  'use strict';

  class ResultsController {
    runQuery() {
      this.resultRunner.run();
    }
  }

  function resultsComponent() {
    return {
      restrict: 'E',
      scope: {
        'query': '=',
        'results': '=',
        'resultRunner': '='
      },
      templateUrl: 'results',
      controller: 'ResultsController',
      controllerAs: 'resultsCtrl',
      bindToController: true
    };
  }

  angular
    .module('alephDirectives.results', ['alephServices'])
    .controller('ResultsController', ResultsController)
    .directive('results', resultsComponent);

}(angular));
