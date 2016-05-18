!(angular => {
  'use strict';

  /* Dirty Aware methods for a collection of DirtyAwareModel's */

  class CollectionDirtyAwareness {

    constructor(models) {
      this._models = models;
    }

    dirtyItems() {
      return _.filter(this._models(), model => model.isDirty());
    }

    isDirty() {
      return this.dirtyItems().length > 0;
    }

    isPristine() {
      return !this.isDirty();
    }

    revert() {
      _.each(this._models(), model => {
        model.revert();
      });
    }
  }

  angular.module('models.collectionDirtyAwareness', [])
    .service('CollectionDirtyAwareness', () => CollectionDirtyAwareness);
}(angular));
