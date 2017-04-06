!(angular => {
  'use strict';

  class MatcherRunner {

    constructor(matchers, items) {
      this._matchers = matchers;
      this._items = items;
    }

    execute(currentContext, filterArgs, prefix) {
      let allMatches = [];
      // override context if user has pressed "." -- which manifests as a prefix ""
      currentContext = prefix == '' ? 'postDot' : currentContext;

      _.each(this._matchers, matcher => {
        if (this._isMatcherRelevant(matcher, currentContext)) {
          let matches = this._uniqueFilteredMatches(matcher, currentContext, filterArgs, prefix);

          _.each(matches, ea => {
            allMatches.push({
              name: ea,
              value: ea,
              score: matcher.contextRelevance[currentContext],
              meta: matcher.meta
            });
          });
        }
      });

      return allMatches;
    }

    // private methods

    _uniqueFilteredMatches(matcher, currentContext, filterArgs, prefix) {
      let filteredItems = _.map(this._items, item => {
        if (!this._matcherFiltersForContext(matcher, currentContext) ||
          this._itemSatisfiesFilters(matcher.contextItemFilters[currentContext], item, filterArgs)) {
          let itemName = _.exists(matcher.nameProperty) ? item[matcher.nameProperty] : item;

          // We want to return everything on empty string because it means that
          // the typing has just begun and anything matches
          if (itemName.indexOf(prefix) === 0 || prefix == '') {
            return itemName;
          }
        }
      });

      return _.compact(_.uniq(filteredItems));
    }

    _itemSatisfiesFilters(filters, item, filterArgs) {
      return _.all(filters, filterFunc => filterFunc(item, filterArgs));
    }

    _matcherFiltersForContext(matcher, currentContext) {
      return _.getPath(matcher, ('contextItemFilters.' + currentContext));
    }

    _isMatcherRelevant(matcher, currentContext) {
      return _.any(_.keys(matcher.contextRelevance), contextKey => {
        return (contextKey === currentContext);
      });
    }
  }

  angular.module('alephServices.matcherRunner', []).service('MatcherRunner', () => MatcherRunner);

}(angular));
