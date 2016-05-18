'use strict';

describe('Page Title Manager', () => {
  const mockApplicationTitle = 'MehD00d';
  let PageTitleManager;
  let $scope;
  let route;

  beforeEach(module('alephServices'));

  beforeEach(module($provide => {
    route = { current: {} };
    $provide.value('$route', route);
    $provide.constant('ApplicationTitle', mockApplicationTitle);
  }));

  beforeEach(inject((_PageTitleManager_) => {
    PageTitleManager = _PageTitleManager_;
    $scope = { $on: jasmine.createSpy('$scope.$on') };
  }));

  describe('#onDestroy', () => {
    beforeEach(() => {
      PageTitleManager.onDestroy($scope);
    });

    it('sets #unset as destroy handler', () => {
      expect($scope.$on.calls.argsFor(0)[0]).toBe('$destroy');
    });
  });

  describe('#getTitle', () => {

    describe('if title is set', () => {
      beforeEach(() => {
        PageTitleManager.title = 'MyTitle';
      });

      it('return the set title', () => {
        expect(PageTitleManager.title).toBe('MyTitle');
      });
    });

    describe('if title is not set but $route.current.title is set', () => {
      beforeEach(() => {
        PageTitleManager.title = undefined;
        route.current.title = 'MyRouteTitle';
      });

      it('return the set title', () => {
        expect(PageTitleManager.title).toBe('MyRouteTitle');
      });
    });


    describe('if title and $route.current.title is not set', () => {
      beforeEach(() => {
        PageTitleManager.title = undefined;
        route.current.title = undefined;
      });

      it('returns the ApplicationTitle', () => {
        expect(PageTitleManager.title).toBe(mockApplicationTitle);
      });
    });
  });

  describe('#unset', () => {
    beforeEach(() => {
      PageTitleManager.title = 'something';
      PageTitleManager.unset();
    });

    it('sets _title to be undefined', () => {
      expect(PageTitleManager._title).toBe(undefined);
    });
  });
});
