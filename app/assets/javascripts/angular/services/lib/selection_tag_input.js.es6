!(angular => {
  'use strict';

  class SelectionTagInput {
    constructor(options) {
      this._items = this._makeItemsFn(options.items, options.iteratee);
      this._itemField = options.itemField;
      this.selectedTags = [];
    }

    add(tag) {
      _.each(this._items(), item => {
        item[this._itemField].unshift(tag.text);
      });
    }

    remove(tag) {
      _.each(this._items(), item => {
        item[this._itemField] = _.reject(item[this._itemField], itemTag => {
          return tag.text === itemTag;
        });
      });
    }

    onSelection() {
      this.selectedTags = _.reduce(this._items(), (acc, item) => {
        return _.uniq(acc.concat(item[this._itemField]));
      }, []);
    }

    // private methods

    _makeItemsFn(items, _iteratee) {
      let rawItems = _.isFunction(items) ? items : () => items;
      let iteratee = _iteratee;
      return _.isFunction(iteratee) ? () => _.map(rawItems(), iteratee) : rawItems;
    }
  }

  angular.module('alephServices.selectionTagInput', []).service('SelectionTagInput', () => SelectionTagInput);

}(angular));
