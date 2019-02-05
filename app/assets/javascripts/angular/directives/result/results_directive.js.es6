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

    updateQuery() {
      this.query.save().then(this._updateSuccess.bind(this))
    }

    generateResultLink(result) {
      return this._hostname + '/results/query/' + this.query.item.id +
        '/query_version/' + this.query.item.version.id + '/result/' + result.item.id;
    }

    alertCopied() {
      this._alertFlash.emitSuccess('Result link copied to clipboard!');
    }

    _updateSuccess(queryItem) {
      this._alertFlash.emitSuccess((queryItem.latest_result_s3_url_flag ? 'Enabled' : 'Disabled') + ' fixed link to lastest result')
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
