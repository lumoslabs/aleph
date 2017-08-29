!(angular => {
  'use strict';

  class RunningResultIndexController {
    constructor($scope, ModelManager, $interval) {
      this._$interval = $interval;
      this._intervalPromises = undefined;
      this._runningResultModelClasses = ModelManager.forModelName('runningResult');
      this._RunningResult = this._runningResultModelClasses.modelClass();
      this._RunningResults = this._runningResultModelClasses.collectionClass(this._RunningResult);
      this.runningResults = new this._RunningResults();
      this._pollForRunningResults();

      $scope.$on('$destroy', () => {
        if (this._intervalPromises !== undefined) {
          this._$interval.cancel(this._intervalPromises);
        }
      });
    }

    // private methods

    _pollForRunningResults() {
      this.runningResults.initCollection();
      this._intervalPromises = this._$interval(() => {
        this.runningResults.initCollection();
      }, 25000);
    }
}

RunningResultIndexController.$inject = ['$scope', 'ModelManager', '$interval'];

angular
  .module('alephControllers.runningResultIndexController', ['alephServices'])
  .controller('RunningResultIndexController', RunningResultIndexController);

}(angular));
