!(angular => {
  'use strict';

  class ModelState {

    constructor(fields, comparators = {}) {
      this._fields = fields;
      this._comparators = this._defaultComparators(fields, comparators);
    }

    snapshotItem(item) {
      this._snapshot = angular.copy(item);
    }

    get snapshot() {
      return angular.copy(this._snapshot);
    }

    isPristine(item) {
      return _.every(this._fields, field => {
        return this._comparators[field] (
          this._resolve(field, item),
          this._resolve(field, this._snapshot)
        );
      });
    }

    isDirty(item) {
      return !this.isPristine(item);
    }

    // private methods

    _resolve(path, obj, safe = true) {
      return path.split('.').reduce((prev, curr) => {
        return !safe ? prev[curr] : (prev ? prev[curr] : undefined);
      }, obj || this);
    }

    _defaultComparators(fields, comparators) {
      let defaulted = {};
      _.each(fields, f => {
        defaulted[f] = comparators[f] || ((l, r) => JSON.stringify(l) === JSON.stringify(r));
      });
      return defaulted;
    }
  }

  angular.module('models.modelState', []).service('ModelState', () => ModelState);

}(angular));
