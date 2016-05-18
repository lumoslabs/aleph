!(angular => {
  'use strict';

  function CollectionModelBaseImports($q) {

    return class CollectionModelBase {

      constructor(resource, Model) {
        this.collection = [];
        this._resource = resource;
        this._Model = Model;
      }

      get Model() {
        return this._Model;
      }

      internalize(items) {
        if(_.exists(items) && _.isArray(items) && items.length > 0) {
          this.collection = _.map(items, this._toModel.bind(this));
        } else {
          this.collection = [];
        }
      }

      initCollection(params) {
        return this._resource.index(params).$promise.then(items => {
          this.internalize(items);
          return this.collection;
        });
      }

      save(saveParams, initParams) {
        return this._saveCollection(saveParams, initParams, this.collection);
      }

      add(item) {
        let model = this._toModel(item);
        this.collection.unshift(model);
        return model;
      }

      remove(item) {
        let index = _.map(this.collection, m => m.item.id).indexOf(item.id);
        return this.collection.splice(index, 1)[0];
      }

      items() {
        return _.map(this.collection, o => o.item);
      }

      // protected methods

      _saveCollection(saveParams, initParams, collection) {
        return $q.all(
            _.map(collection, m => m.save(saveParams))
          ).then(this.initCollection.bind(this, initParams));
      }

      // private methods

      _toModel(item) {
        let m = new this._Model();
        m.internalize(item);
        return m;
      }
    };
  }

  CollectionModelBaseImports.$inject = ['$q'];

  angular.module('models.collectionModelBase', [])
    .service('CollectionModelBase', CollectionModelBaseImports);

}(angular));
