!(angular => {
  'use strict';

  class ResultsController {

    constructor(AlertFlash) {
      this._alertFlash = AlertFlash;
      this._hostname = angular.copy(location.host);
    }

    runQuery() {
      this.resultRunner.run();
    }

    generateResultLink(result) {
      return this._hostname + '/results/query/' + this.query.item.id +
        '/query_version/' + this.query.item.version.id + '/result/' + result.item.id;
    }

    alertCopied() {
      this._alertFlash.emitSuccess('Result link copied to clipboard!');
    }
  }

  ResultsController.$inject = ['AlertFlash'];

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
