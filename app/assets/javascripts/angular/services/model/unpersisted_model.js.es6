!(angular => {
  'use strict';

  class UnpersistedModel {
    constructor() {
      this.item = {};
    }

    internalize(item) {
      this.item = item;
    }

    save() {
      throw 'Cannot save an unpersisted model';
    }
  }

  angular.module('models.unpersistedModel', []).service('UnpersistedModel', () => UnpersistedModel);

}(angular));
