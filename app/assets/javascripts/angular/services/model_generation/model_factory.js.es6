!(angular => {
  'use strict';

  function ModelFactory(StandardModel, StandardCollectionModel) {

    this.makeCollectionModel = function makeCollectionModel(name, Model, resource) {
      return class FactoryCollectionModel extends StandardCollectionModel {
        constructor() {
          super(name, resource, Model);
        }
      };
    };

    this.makeModel = function makeModel(name, newItem, resource, options = {}) {
      let dirtyAwareFields = options.dirtyAwareFields || _.keys(newItem);
      let dirtyAwareComparators = options.dirtyAwareComparators;

      return class FactoryModel extends StandardModel {
        constructor() {
          super(name, resource, newItem, dirtyAwareFields, dirtyAwareComparators);
        }
      };
    };
  }

  ModelFactory.$inject = ['StandardModel', 'StandardCollectionModel'];
  angular.module('modelGeneration.modelFactory', []).service('ModelFactory', ModelFactory);
}(angular));
