!(angular => {
  'use strict';

  function DirtyAwareCollectionModelImports(CollectionDirtyAwareness, CollectionModelBase) {

    return class DirtyAwareCollectionModel extends CollectionModelBase {

      constructor(resource, Model) {
        super(resource, Model);
        this._collectionDirtyAwareness = new CollectionDirtyAwareness(() => this.collection);

        // delegated methods

        this.dirtyItems     = this._collectionDirtyAwareness.dirtyItems.bind(this._collectionDirtyAwareness);
        this.isDirty        = this._collectionDirtyAwareness.isDirty.bind(this._collectionDirtyAwareness);
        this.isPristine     = this._collectionDirtyAwareness.isPristine.bind(this._collectionDirtyAwareness);
        this.revert         = this._collectionDirtyAwareness.revert.bind(this._collectionDirtyAwareness);
      }

      save(saveParams, initParams) {
        return this._saveCollection(saveParams, initParams, this.dirtyItems());
      }
    };
  }

  DirtyAwareCollectionModelImports.$inject = ['CollectionDirtyAwareness', 'CollectionModelBase'];

  angular.module('models.dirtyAwareCollectionModel', [])
    .service('DirtyAwareCollectionModel', DirtyAwareCollectionModelImports);

}(angular));
