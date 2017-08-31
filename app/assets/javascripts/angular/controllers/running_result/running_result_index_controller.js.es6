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

      // angular sorting
      this.predicate = 'started_at';
      this.reverse = false;
      this.sortDirState = { started_at: false, author: true, duration_seconds: false, query_title: false };
    }

    setPredicate(predicate) {
      if (predicate === this.predicate) {
         this.reverse = !this.reverse;
       } else {
         this.predicate = predicate;
         this.reverse = !!this.sortDirState[predicate];
       }
    }

    getPredicate() {
      return 'item.' + this.predicate;
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
