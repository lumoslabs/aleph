!(angular => {
  'use strict';

  class PageTitleManager {

    constructor(ApplicationTitle, $route) {
      this._defaultTitle = ApplicationTitle;
      this._$route = $route;
    }

    set title(t) {
      this._title = t;
    }

    get title() {
      if (Utils.stringHelpers.isPresent(this._title)) {
        return this._title;
      } else if(this._$route.current && Utils.stringHelpers.isPresent(this._$route.current.title)) {
        return this._$route.current.title;
      } else {
        return this._defaultTitle;
      }
    }

    onDestroy(scope) {
      let _this = this;
      scope.$on('$destroy', this.unset.bind(_this));
    }

    unset() {
      this.title = undefined;
    }
  }

  PageTitleManager.$inject = ['ApplicationTitle', '$route'];
  angular.module('alephServices.pageTitleManager', []).service('PageTitleManager', PageTitleManager);

}(angular));
