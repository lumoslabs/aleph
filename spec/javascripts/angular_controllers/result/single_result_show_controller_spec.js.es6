'use strict';

describe('Single Result Show Controller', () => {
  let SingleResultShowController;
  let $routeParams;
  let Query;
  let query;
  let Result;
  let result;
  let PageTitleManager;
  let digest;

  function setUpRouteParams(_$routeParams_) {
    $routeParams =  _$routeParams_;
    $routeParams.queryId = 1;
    $routeParams.queryVersionId = 2;
    $routeParams.resultId = 3;
  }

  function setUpQuery($q) {
    [Query, query] = TestUtils.classAndInstance('Query', {
      initItem: jasmine.createSpy('query.initItem').and.returnValue($q.when({ title: 'my query' }))
    });
  }

  function setUpResult() {
    [Result, result] = TestUtils.classAndInstance('Result', {
      initItem: jasmine.createSpy('result.initItem')
    });
  }

  beforeEach(module('alephControllers'));

  beforeEach(inject(($controller, _$routeParams_, $rootScope, $q) => {
    digest = () => { $rootScope.$digest(); };
    setUpRouteParams(_$routeParams_);
    setUpQuery($q);
    setUpResult();
    PageTitleManager = {};
    SingleResultShowController = $controller('SingleResultShowController', {
      Query: Query,
      Result: Result,
      PageTitleManager: PageTitleManager
    });
  }));

  describe('on construction', () => {

    it('inits a query', () => {
      expect(Query).toHaveBeenCalled();
    });

    it('inits a result', () => {
      expect(Result).toHaveBeenCalled();
    });

    describe('on digest', () => {
      let expectedTitle = 'Result id=3 for "my query"';
      beforeEach(() => {
        digest();
      });

      it('sets page title', () => {
        expect(PageTitleManager.title).toBe(expectedTitle);
      });

      it('sets panel title', () => {
        expect(SingleResultShowController.panelTitle).toBe(expectedTitle);
      });
    });
  });
});
