!(angular => {
  'use strict';

  function StandardModelImports(DirtyAwareModel, ActionHandler) {

    return class StandardModel extends DirtyAwareModel {
      constructor(name, resource, newItem, dirtyAwareFields, dirtyAwareComparators) {
        super(resource, dirtyAwareFields, dirtyAwareComparators);
        this._handler = new ActionHandler(name, { modelItem: () => this.item });
        this._newItemObj = newItem;
      }

      fetch(params) {
        return this._handler.wrapFetch(super.fetch.bind(this, params));
      }

      destroy() {
        return this._handler.wrapDestroy(super.destroy.bind(this));
      }

      update(params) {
        return this._handler.wrapUpdate(super.update.bind(this, params));
      }

      create(params) {
        return this._handler.wrapCreate(super.create.bind(this, params));
      }

      _newItem() {
        // must ensure this method returns a fresh new object each time
        return angular.copy(this._newItemObj);
      }
    };
  }

  StandardModelImports.$inject = ['DirtyAwareModel', 'ActionHandler'];
  angular.module('modelGeneration.standardModel', ['models']).service('StandardModel', StandardModelImports);
}(angular));
