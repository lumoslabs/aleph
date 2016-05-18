!(angular => {
  'use strict';

  class ResultController {
    constructor($scope, getResultCsv, AlertFlash, $window) {
      this._alertFlash = AlertFlash;
      this._$window = $window;
      this.getCsv = () => getResultCsv(this.result.item.id);

      /* Need to poll in the directive otherwise wonky-ness occurs in the UI
         When we run from the query details tab */
      this.result.poller.poll();
      $scope.$on('$destroy', () => {
        this.result.poller.unPoll();
      });
    }

    resultHasParameters() {
      if (!this.result.item.parameters) {
        return false;
      } else {
        return _.keys(this.result.item.parameters).length > 0;
      }
    }

    deleteResult() {
      return this.result.destroy().then(result => {
        this._alertFlash.emitInfo('Result id = ' + result.id + ' has be deleted!');
        if (this.results) {
          this.results.remove(result);
        } else {
          return result;
        }
      });
    }
  }

  ResultController.$inject = ['$scope', 'getResultCsv', 'AlertFlash', '$window'];

  function resultComponent() {
    return {
      restrict: 'E',
      scope: {
        'result': '=',
        'results': '='
      },
      templateUrl: 'result',
      controller: 'ResultController',
      controllerAs: 'resultCtrl',
      bindToController: true
    };
  }

  angular
    .module('alephDirectives.result', ['alephServices'])
    .controller('ResultController', ResultController)
    .directive('result', resultComponent);

}(angular));
