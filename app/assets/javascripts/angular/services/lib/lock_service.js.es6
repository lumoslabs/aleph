(angular => {
  'use strict';

  class LockService {

    constructor() {
      this._locks = {};
    }

    attemptAcquire(lock) {
      if(this._locks[lock]) {
        return false;
      } else {
        this._locks[lock] = true;
        return true;
      }
    }

    release(lock) {
      delete this._locks[lock];
    }

    tryWithLockAsync(lock, criticalSection) {
      if(this.attemptAcquire(lock)) {
        try {
          this._locks[lock] = true;
          return criticalSection(this.release.bind(this, lock));
        } catch (e) {
          this.release(lock);
          throw e;
        }
      }
    }

    tryWithLock(lock, criticalSection) {
      if(this.attemptAcquire(lock)) {
        try {
          this._locks[lock] = true;
          return criticalSection();
        } finally {
          this.release(lock);
        }
      }
    }
  }

  angular.module('alephServices.lockService', []).service('$lock', LockService);
}(angular));
