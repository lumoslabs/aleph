'use strict';

describe('RunningResultIndexController', () => {
  let RunningResultIndexController;
  let runningResults;
  let runningResult;
  let $scope;
  let $intervalSpy;
  let ModelManager;

  beforeEach(module('alephControllers'));

  beforeEach(module($provide => {
    let provide = ProvisionHelper.withProvide($provide);
    runningResult = {};
    runningResults = {};

    ModelManager = provide.value(
      'ModelManager',
      SharedMocks.ModelManager(
        SharedClassMocks.Model(runningResult),
        SharedClassMocks.CollectionModel(runningResults)
      )
    );
  }));

  beforeEach(inject(($controller, $q, $interval, $rootScope) => {

    $scope = $rootScope.$new();
    spyOn($scope, '$on').and.callThrough();

    runningResults.initCollection = jasmine.createSpy('runningResults.initCollection')
      .and.returnValue($q.when('success'));
    runningResult.initItem = jasmine.createSpy('runningResult.initItem');

    $intervalSpy = jasmine.createSpy('$interval', $interval);
    spyOn($intervalSpy, 'cancel');

    RunningResultIndexController = $controller('RunningResultIndexController', {
      $scope: $scope,
      $interval: $intervalSpy
    });
  }));

  describe('on initialization', () => {
    it('calls runningResults.initCollection', () => {
      expect(runningResults.initCollection).toHaveBeenCalled();
    });

    it('sets up polling', () => {
      expect($intervalSpy).toHaveBeenCalledWith(jasmine.any(Function), 25000);
    });

    it('register a callback on destroy', () => {
      expect($scope.$on).toHaveBeenCalledWith('$destroy', jasmine.any(Function));
    });

    it('de-poll on destroy', () => {
      $scope.$destroy();
      expect($intervalSpy.cancel).toHaveBeenCalled();
    });
  });

  describe('#setPredicate', () => {
    describe('when predicate is the same as the previous predicate', () => {
      beforeEach(() => {
        RunningResultIndexController.predicate = 'meh';
        RunningResultIndexController.reverse = true;
        RunningResultIndexController.setPredicate('meh');
      });

      it('reverses the reverse field while maintaining the same predicate', () => {
        expect(RunningResultIndexController.reverse).toEqual(false);
      });

      it('maintain the same predicate', () => {
        expect(RunningResultIndexController.predicate).toEqual('meh');
      });
    });

    describe('when the predicate is different than previous predicate', () => {
      beforeEach(() => {
        RunningResultIndexController.predicate = 'meh1';
        this.initialSortDirections = { meh1: false };
        RunningResultIndexController.reverse = true;
        RunningResultIndexController.setPredicate('meh2');
      });

      it('sets the reverse field as whatever is the initialSortDirections for that predicate', () => {
        expect(RunningResultIndexController.reverse).toEqual(false);
      });

      it('sets a new predicate', () => {
        expect(RunningResultIndexController.predicate).toEqual('meh2');
      });
    });
  });

  describe('#getPredicate', () => {
    it("appends 'item.' to deal with the fact that fields are nested in 'item'", () => {
      RunningResultIndexController.predicate = 'meh';
      expect(RunningResultIndexController.getPredicate()).toEqual('item.meh');
    });
  });
});
