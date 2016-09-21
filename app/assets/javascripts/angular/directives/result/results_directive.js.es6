!(angular => {
  'use strict';

  class ResultsController {

    constructor($location, AlertFlash) {
      this._alertFlash = AlertFlash;

      this._host = $location.host();
      //FIXME: there must be a way to do this?
      if(this._host === 'localhost') {
        this._host = this._host + ':' + $location.port();
      }
    }

    runQuery() {
      this.resultRunner.run();
    }

    generateResultLink(result) {
      return this._host + '/results/query/' + this.query.item.id +
        '/query_version/' + this.query.item.version.id + '/result/' + result.item.id;
    }

    alertCopied() {
      this._alertFlash.emitSuccess('Result link copied to clipboard!');
    }
  }

  ResultsController.$inject = ['$location', 'AlertFlash'];

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
