!(angular => {
  'use strict';

  function PaginationImports($lock, CollectionDirtyAwareness, $q) {

    return class Pagination {

      constructor(lockKey, resourceAction, Model, options = {}) {
        this.search = options.initialSearch;
        this.sortBy = options.initialSort;
        this._Model = Model;
        this._resourceAction = resourceAction;
        this._lockKey = lockKey;
        this._limit = options.limit || 30;
        this._sortDescending = options.sortDescending === false ? false : true;
        this._spinnerOn = _.partial(this._optionalCall, options.spinnerOn);
        this._spinnerOff = _.partial(this._optionalCall, options.spinnerOff);
        this._additionalParams = options.additionalParams || {};
        this._$q = $q;
        this._init();
      }

      reload() {
        this._init();
        this._fetch();
      }

      toggleSortOrder() {
        this._sortDescending = !this._sortDescending;
      }

      fetch() {
        if (!this._done) {
          this._fetch();
        }
      }

      save(params) {
        return this._$q.all(_.map(this.dirtyItems(), m => m.save(params)));
      }

      // expose collection dirty awareness functionality

      dirtyItems() {
        return this._collectionDirtyAwareness.dirtyItems();
      }

      isDirty() {
        return this._collectionDirtyAwareness.isDirty();
      }

      isPristine() {
        return this._collectionDirtyAwareness.isPristine();
      }

      revert() {
        return this._collectionDirtyAwareness.revert();
      }

      // private methods

      _init() {
        this.collection = [];
        this._collectionDirtyAwareness = new CollectionDirtyAwareness(() => this.collection);
        this._offset = 0;
        this._done = false;
        this._spinnerOn();
      }

      _optionalCall(f, ...args) {
        if(_.exists(f) && _.isFunction(f)) {
          f.apply(args);
        }
      }

      _fetch() {
        $lock.tryWithLockAsync(this._lockKey, unlock => {
          let params = _.merge({
            offset: this._offset,
            limit: this._limit,
            search: this.search,
            sort_by: this.sortBy,
            sort_descending: this._sortDescending
          }, this._additionalParams);

          this._resourceAction(params, items => {
            if (items.length === 0) {
              this._done = true;
            } else {
              _.each(items, item => {
                let m = new this._Model();
                m.internalize(item);
                this.collection.push(m);
              });
            }
            this._offset++;
            this._spinnerOff();
            unlock();
            return items;
          },
          err => {
            this._spinnerOff();
            unlock();
            return err;
          });
        });
      }
    };
  }

  PaginationImports.$inject = ['$lock', 'CollectionDirtyAwareness', '$q'];
  angular.module('alephServices.pagination', ['models']).service('Pagination', PaginationImports);

}(angular));
