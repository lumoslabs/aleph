'use strict';

describe('Navigation Guard', () => {
  let NavigationGuard;
  let navigationGuard;
  let $scope;
  let mockWindow;
  let originalOnBeforeUnload;
  let $rs;
  let digest;
  let eventStub;
  let onBeforeUnloadSpy;
  let locationChangeStartSpy;

  beforeEach(module('alephServices'));

  beforeEach(module(($provide) => {
    originalOnBeforeUnload = jasmine.createSpy('previousOnBeforeUnload');
    mockWindow = { onbeforeunload: originalOnBeforeUnload };
    $provide.value('$window', mockWindow);
  }));

  beforeEach(inject((_NavigationGuard_, $rootScope) => {
    NavigationGuard = _NavigationGuard_;
    $rs = $rootScope;
    $scope = $rootScope.$new();
    spyOn($scope, '$on').and.callThrough();
    digest = () => { $rootScope.$digest(); };
    navigationGuard = new NavigationGuard($scope);
    eventStub = {

    };
  }));

  describe('on construction', () => {
    it('sets a destroy handler', () => {
      expect($scope.$on.calls.argsFor(0)[0]).toBe('$destroy');
    });
  });

  describe('on callbacks are registration', () => {
    beforeEach(() => {
      onBeforeUnloadSpy = jasmine.createSpy('onBeforeUnloadSpy');
      locationChangeStartSpy = jasmine.createSpy('locationChangeStartSpy');
      navigationGuard
        .registerOnBeforeUnload(onBeforeUnloadSpy)
        .registerLocationChangeStart(locationChangeStartSpy);
    });

    describe('when it is enabled', () => {
      describe('on location change start', () => {
        beforeEach(() => {
          $scope.$broadcast('$locationChangeStart', eventStub);
          digest();
        });

        it('registered function will not be called', () => {
          expect(locationChangeStartSpy).toHaveBeenCalled();
        });
      });

      describe('on before unload', () => {
        beforeEach(() => {
          mockWindow.onbeforeunload();
        });

        it('egistered function will not be called', () => {
          expect(onBeforeUnloadSpy).toHaveBeenCalled();
        });
      });
    });

    describe('when it is disabled', () => {
      beforeEach(() => {
        navigationGuard.disable();
      });

      describe('on location change start', () => {
        beforeEach(() => {
          $scope.$broadcast('$locationChangeStart', eventStub);
          digest();
        });

        it('registered function will not be called', () => {
          expect(locationChangeStartSpy).not.toHaveBeenCalled();
        });
      });

      describe('on before unload', () => {
        beforeEach(() => {
          mockWindow.onbeforeunload();
        });

        it('egistered function will not be called', () => {
          expect(onBeforeUnloadSpy).not.toHaveBeenCalled();
        });
      });
    });

  });
});
