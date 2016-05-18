!(angular => {
  'use strict';

  function NavigationGuardImports($window) {
    return class NavigationGuard {
      constructor($scope) {
        this._$scope = $scope;
        this._disabled = false;
        this._previousOnBeforeUnload = $window.onbeforeunload;
        $scope.$on('$destroy', () => {
          $window.onbeforeunload = this._previousOnBeforeUnload;
        });
      }

      registerOnBeforeUnload(fn) {
        $window.onbeforeunload = () => {
          if(this._disabled) {
            return this._previousOnBeforeUnload();
          } else {
            return fn();
          }
        };
        return this;
      }

      registerLocationChangeStart(fn) {
        this._$scope.$on('$locationChangeStart', (e) => {
          if (!this._disabled) { return fn(e); }
        });
        return this;
      }

      disable() {
        this._disabled = true;
      }

      static defaultPreventer() {
        return e => { e.preventDefault(); };
      }
    };
  }

  NavigationGuardImports.$inject = ['$window'];
  angular.module('alephServices.navigationGuard', []).service('NavigationGuard', NavigationGuardImports);
}(angular));
