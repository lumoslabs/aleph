!(angular => {
  'use strict';

  function VisualizationsImports(Visualization, ModelManager) {
    return ModelManager.forModelName('visualization').collectionClass(Visualization);
  }

  VisualizationsImports.$inject = ['Visualization', 'ModelManager'];
  angular.module('alephServices.visualizations', []).service('Visualizations', VisualizationsImports);

}(angular));
