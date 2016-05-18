'use strict';

var Utils = Utils || {};

Utils.arrayHelpers = {
  removeItem: function(collection, findIdxFn) {
    var itemIdx = _.findIndex(collection, findIdxFn)
    collection.splice(itemIdx, 1);
    return collection;
  },
  compare: function compare(left, right, iteratee) {
    return (left.length === right.length) &&
        _.every(left, function(leftItem) {
          return _.some(right, function(rightItem) {
            if (_.exists(iteratee)) {
              return iteratee(leftItem) === iteratee(rightItem);
            } else {
              return leftItem === rightItem;
            }
          });
        });
  }
};

Utils.stringHelpers = {
  isPresent: function(str) {
    return !(str||'').match(/^\s*$/);
  }
};
