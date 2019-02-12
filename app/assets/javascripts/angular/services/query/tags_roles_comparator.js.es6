!(angular => {
  'use strict';

  class TagsAndRolesComparator {
    compare(left, right) {
      if(left === undefined && right === undefined) {
        return true;
      } else if(left === undefined) {
        return false;
      } else if(right === undefined) {
        return false;
      }

      if(left.length != right.length) {
        return false;
      }

      var unwrappedLeft = _.map(left, value => {
        return _.isObject(value) ? value['text'] : value;
      });

      var unwrappedRight = _.map(right, value => {
        return _.isObject(value) ? value['text'] : value;
      });

      return _.difference(unwrappedLeft, unwrappedRight).length == 0;
    }
  }

  angular.module('alephServices.tagsAndRolesComparator', []).service('TagsAndRolesComparator', TagsAndRolesComparator);

}(angular));
