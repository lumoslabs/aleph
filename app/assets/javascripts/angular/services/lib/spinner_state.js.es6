!(angular => {
  'use strict';

  class Spinner {

    constructor(context) {
      this.context = context;
      this.active = false;
    }

    on() {
      this.active = true;
    }

    off() {
      this.active = false;
    }
  }

  class SpinnerState {
    constructor() {
      this._spinnersMap = {};
    }

    withContext(context) {
      if (!_.has(this._spinnersMap, context))  {
        this._spinnersMap[context] = new Spinner(context);
      }

      return this._spinnersMap[context];
    }

    isActive() {
      return _.some(this._spinners(), spinner => spinner.active );
    }

    _spinners() {
      return _.values(this._spinnersMap);
    }

  }

  angular.module('alephServices.spinnerState', []).service('SpinnerState', SpinnerState);

}(angular));
