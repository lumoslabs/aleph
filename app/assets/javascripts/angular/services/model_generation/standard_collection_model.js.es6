!(angular => {
  'use strict';

  function StandardCollectionModelImports(DirtyAwareCollectionModel, ActionHandler) {

    return class StandardCollectionModel extends DirtyAwareCollectionModel {
      constructor(name, resource, Model) {
        super(resource, Model);
        this._handler = new ActionHandler(name, { modelCollection: () => this.collection });
      }

      initCollection(params) {
        return this._handler.wrapInitCollection(super.initCollection.bind(this, params));
      }

      save(saveParams, initParams) {
        return this._handler.wrapCollectionSave(super.save.bind(this, saveParams, initParams));
      }
    };
  }

  StandardCollectionModelImports.$inject = ['DirtyAwareCollectionModel', 'ActionHandler'];
  angular.module('modelGeneration.standardCollectionModel', ['models'])
    .service('StandardCollectionModel', StandardCollectionModelImports);
}(angular));
