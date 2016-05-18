'use strict';

describe('QueryShowController', () => {
  let QueryShowController;
  let QueryLoader;
  let PageTitleManager;
  let QueryTab;
  let ResultRunner;
  let resultRunner;
  let digest;
  let data;
  let callback;
  let $scope;

  beforeEach(module('alephControllers'));

  beforeEach(inject(($controller, _QueryLoader_, _PageTitleManager_, _QueryTab_, $rootScope, $q) => {
    digest = function() { $rootScope.$digest(); };
    [ResultRunner, resultRunner] = TestUtils.classAndInstance('ResultRunner', {});

    data = {
      query: {
        title: 'a query title 4 great justice'
      }
    };

    QueryLoader = _QueryLoader_;
    spyOn(QueryLoader, 'initialize');
    spyOn(QueryLoader, 'load').and.returnValue($q.when(data));
    QueryLoader.query = 'queryModel';
    QueryLoader.results = 'resultsModel';

    PageTitleManager = _PageTitleManager_;
    spyOn(PageTitleManager, 'onDestroy');

    QueryTab = _QueryTab_;
    spyOn(QueryTab, 'setActiveTabFromUrl');
    spyOn(QueryTab, 'getTab').and.returnValue('results');
    spyOn(QueryTab, 'setTab');

    $scope = {};
    QueryShowController = $controller('QueryShowController', {
      $scope: $scope,
      ResultRunner: ResultRunner
    });

    callback = jasmine.createSpy('callback');
    QueryShowController.componentCallbacks = [callback];
  }));

  describe('on construction', () => {
    it('calls QueryTab.setActiveTabFromUrl', () => {
      expect(QueryTab.setActiveTabFromUrl).toHaveBeenCalled();
    });

    it('calls QueryLoader.initialize', () => {
      expect(QueryLoader.initialize).toHaveBeenCalled();
    });

    it('calls QueryLoader.load', () => {
      expect(QueryLoader.load).toHaveBeenCalled();
    });

    describe('on load sucess', () => {
      beforeEach(() => {
        digest();
      });

      it('sets the page title', () => {
        expect(PageTitleManager.title).toEqual('a query title 4 great justice');
      });

      it('sets $scope to PageTitleManager.onDestroy', () => {
        expect(PageTitleManager.onDestroy).toHaveBeenCalledWith($scope);
      });

      it('a result runner is constructed properly', () => {
        expect(ResultRunner).toHaveBeenCalledWith(QueryLoader.query, QueryLoader.results, { enableAlert: true });
      });

      it('fire off callbacks', () => {
        expect(callback).toHaveBeenCalledWith(data);
      });
    });
  });

  describe('#setTabInUrl', () => {
    beforeEach(() => {
      QueryShowController.setTabInUrl('query');
    });

    it('checks the current tab', () => {
      expect(QueryTab.getTab).toHaveBeenCalled();
    });

    it('call QueryTab.setTab if tab arg is different than current tab', () => {
      expect(QueryTab.setTab).toHaveBeenCalledWith('query');
    });
  });
});
