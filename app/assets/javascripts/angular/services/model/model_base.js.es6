!(angular => {
  'use strict';

  function ModelBaseImports($q) {

    return class ModelBase {

      constructor(resource) {
        this._resource = resource;
        this.item = {};
      }

      internalize(item) {
        if (item) {
          this.item = item;
        } else {
          this.item = {};
        }
      }

      // higher order CRUD functions
      initItem(itemId) {
        if(itemId) {
          return this.fetch({ id: itemId });
        } else {
          this.item = this._newItem();
          return $q.when(this.item);
        }
      }

      save(params) {
        return this.isPersisted() ? this.update(_.merge(this.item, params)) : this.create(_.merge(this.item, params));
      }

      // fundemental CRUD functions
      destroy() {
        return this._resource.destroy({ id: this.item.id }).$promise.then(item => item);
      }

      clone() {
        let clone = angular.copy(this);
        clone._item.id = undefined;
        return clone;
      }

      fetch(params) {
        return this._resource.show(params).$promise.then(i => {
          this.item = i;
          return this.item;
        });
      }

      update(params) {
        return this._resource.update(params).$promise.then(i => {
          this.item = i;
          return this.item;
        });
      }

      create(params) {
        return this._resource.create(params).$promise.then(i => {
          this.item = i;
          return this.item;
        });
      }

      isPersisted() {
        return _.exists(this.item.id);
      }

      isNew() {
        return JSON.stringify(this.item) === JSON.stringify(this._newItem());
      }

      // protected methods

      _newItem() {
        throw '#_newItem must be implemented in subclasses!';
      }
    };
  }

  ModelBaseImports.$inject = ['$q'];
  angular.module('models.modelBase', []).service('ModelBase', ModelBaseImports);

}(angular));
