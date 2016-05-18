!(angular => {
  'use strict';

  angular
    .module('models', [
      'models.collectionDirtyAwareness',
      'models.dirtyAwareCollectionModel',
      'models.dirtyAwareModel',
      'models.modelState',
      'models.collectionModelBase',
      'models.modelBase',
      'models.unpersistedModel'
    ]);

}(angular));
