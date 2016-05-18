(angular => {
  'use strict';

  /* utilize lock service to ensure we don't make http request unless
     previous one has returned */

  class LockingPollService {

    constructor($lock, $interval) {
      this._intervalPromises = {};
      this._$lock = $lock;
      this._$interval = $interval;
      this.poll = _.wrap(this.pollWithFunction.bind(this), (func, resource, key, stopPolling) => {
        return func(() => resource.$get(), key, stopPolling);
      });
    }

    unPoll(key) {
      this._$interval.cancel(this._intervalPromises[key]);
      delete this._intervalPromises[key];
    }

    pollWithFunction(pollFunction, key, stopPolling) {
      this._intervalPromises[key] = this._$interval(() => {
        if (stopPolling()) {
          this.unPoll(key);
        } else {
          /* request http get for a resource inside a lock
              1) lock on key
              2) $get makes an http request for the resource
              3) (async) 'unlock' = callback function which releases the lock when the http request finishes */
          this._$lock.tryWithLockAsync(key, unlock => {
            pollFunction().then(unlock);
          });
        }
      }, 5000);
    }
  }

  LockingPollService.$inject = ['$lock', '$interval'];
  angular.module('alephServices.pollService', []).service('PollService', LockingPollService);
}(angular));
