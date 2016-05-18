!(angular => {
  'use strict';

  function PaginationComponentsImports($location, Pagination, SpinnerState) {

    return class PaginationComponents {

      constructor(key, resourceAction, Model, options = {}) {
        this._spinner = SpinnerState.withContext(key);
        this.searchText = this._intialSearch();

        //default options
        let additionalParams = options.additionalParams || {};
        let sortBy = options.sortBy || 'updated_at';
        let limit = options.limit;

        this._pagination = new Pagination(key, resourceAction, Model, {
          initialSearch: this.searchText,
          initialSort: sortBy,
          limit: limit,
          spinnerOn: this._spinner.on.bind(this._spinner),
          spinnerOff: this._spinner.off.bind(this._spinner),
          additionalParams: additionalParams
        });

        // delegated methods
        this.reload             = this._pagination.reload.bind(this._pagination);
        this.toggleSortOrder    = this._pagination.toggleSortOrder.bind(this._pagination);
        this.loadMore           = this._pagination.fetch.bind(this._pagination);
        this.dirtyItems         = this._pagination.dirtyItems.bind(this._pagination);
        this.isDirty            = this._pagination.isDirty.bind(this._pagination);
        this.isPristine         = this._pagination.isPristine.bind(this._pagination);
        this.revert             = this._pagination.revert.bind(this._pagination);
        this.save               = this._pagination.save.bind(this._pagination);
      }

      items() {
        return _.map(this.collection(), o => o.item);
      }

      collection() {
        return this._pagination.collection;
      }

      clearSearch() {
        if (this.searchText && this.searchText !== '') {
          this.searchText = null;
        }
        this.triggerSearch();
      }

      setSearch(text, quote) {
        if (quote) {
          this.searchText = '\"' + text + '\"';
        } else {
          this.searchText = text;
        }
        this.triggerSearch();
      }

      setSort(sortBy) {
        if (sortBy === this._pagination.sortBy) {
          this._pagination.toggleSortOrder();
        } else {
          this._pagination.sortBy = sortBy;
        }
        this._pagination.reload();
      }

      triggerSearch() {
        $location.search('search', this.searchText);
        this._pagination.search = this.searchText;
        this._pagination.reload();
      }

      // private methods

      _intialSearch() {
        let searchObject = $location.search();
        if (!_.isEmpty(searchObject)) {
          return searchObject.search;
        }
      }
    };
  }

  PaginationComponentsImports.$inject = ['$location', 'Pagination', 'SpinnerState'];
  angular.module('alephServices.paginationComponents', [])
    .service('PaginationComponents', PaginationComponentsImports);

}(angular));
