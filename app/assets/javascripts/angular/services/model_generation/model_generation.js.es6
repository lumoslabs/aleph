!(angular => {
  'use strict';

  angular
    .module('modelGeneration', [
      'modelGeneration.modelFactory',
      'modelGeneration.modelManager',
      'modelGeneration.resourceFactory',
      'modelGeneration.standardModel',
      'modelGeneration.standardCollectionModel'
    ]);

}(angular));
