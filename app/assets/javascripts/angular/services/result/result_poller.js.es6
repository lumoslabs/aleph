!(angular => {
  'use strict';

  function ResultPollerImports(PollService) {

    return class ResultPoller {
      constructor(result) {
        this._result = result;
      }

      poll() {
        let result = this._result.item;
        this.pollingKey = 'result_' + result.id + '_' + new Date().getTime();

        PollService.poll(
          result,
          this.pollingKey,
          () => (result.status === 'complete' || result.status === 'failed') ? true : false
        );
      }

      unPoll() {
        PollService.unPoll(this.pollingKey);
      }
    };
  }

  ResultPollerImports.$inject = ['PollService'];
  angular.module('alephServices.resultPoller', []).service('ResultPoller', ResultPollerImports);
}(angular));
