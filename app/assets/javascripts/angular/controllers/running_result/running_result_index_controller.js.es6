!(angular => {
  'use strict';

  class RunningResultIndexController {
    constructor($scope, ModelManager, $interval) {
      this._$interval = $interval;
      this._runningResultModelClasses = ModelManager.forModelName('runningResult');
      this._RunningResult = this._runningResultModelClasses.modelClass();
      this._RunningResults = this._runningResultModelClasses.collectionClass(this._RunningResult);
      this.runningResults = new this._RunningResults();
      this._pollForRunningResults();

      $scope.$on('$destroy', () => {
        this._$interval.cancel(this._intervalPromises);
      });

      // angular sorting
      this.initialSortDirections = { started_at: true, author: true, duration_seconds: true, query_title: false };
    }

    isRepl(result) {
      return !_.exists(result.item.query_id) || !_.exists(result.item.query_version_id);
    }

    getType(result) {
      return this.isRepl(result) ? 'REPL' : 'SAVED';
    }

    setPredicate(predicate) {
      if (predicate === this.predicate) {
         this.reverse = !this.reverse;
       } else {
         this.predicate = predicate;
         this.reverse = !!this.initialSortDirections[predicate];
       }
    }

    getPredicate() {
      return 'item.' + this.predicate;
    }

    // private methods

    _pollForRunningResults() {
      this.runningResults.initCollection();
      this._intervalPromises = this._$interval(() => this.runningResults.initCollection(), 25000);
    }
}

RunningResultIndexController.$inject = ['$scope', 'ModelManager', '$interval'];

angular
  .module('alephControllers.runningResultIndexController', ['alephServices'])
  .controller('RunningResultIndexController', RunningResultIndexController);

}(angular));
