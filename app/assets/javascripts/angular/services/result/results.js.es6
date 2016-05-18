!(angular => {
  'use strict';

  function ResultsImports(Result, ModelManager) {
    return ModelManager.forModelName('result').collectionClass(Result);
  }

  ResultsImports.$inject = ['Result', 'ModelManager'];
  angular.module('alephServices.results', []).service('Results', ResultsImports);
}(angular));
