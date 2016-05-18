'use strict';

describe('Query Loader', () => {
  let QueryLoader;
  let Query;
  let query;
  let QueryVersions;
  let queryVersions;
  let Results;
  let results;
  let VisualizationService;
  let digest;
  let $routeParams;
  let response;

  beforeEach(module('alephServices'));

  beforeEach(module($provide => {
    let provide = ProvisionHelper.withProvide($provide);

    [Query, query] = provide.classAndInstanceValue('Query', {});
    [QueryVersions, queryVersions] = provide.classAndInstanceValue('QueryVersions', {});
    [Results, results] = provide.classAndInstanceValue('Results', {});
    VisualizationService = provide.value('VisualizationService', {});

    $routeParams = provide.value('$routeParams', {
      query_id: 1,
      query_version_id: 2,
    });
  }));

  beforeEach(inject((_QueryLoader_, $rootScope, $q) => {
    digest = () => { $rootScope.$digest(); };
    QueryLoader = _QueryLoader_;

    response = {
      id: 1,
      version: {
        id: 2
      }
    };

    query.initItem = jasmine.createSpy('query.initItem')
      .and.returnValue($q.when(response));
    queryVersions.initCollection = jasmine.createSpy('queryVersions.initCollection')
      .and.returnValue($q.when('versions'));
    results.initCollection = jasmine.createSpy('results.initCollection')
      .and.returnValue($q.when('results'));
    VisualizationService.load = jasmine.createSpy('VisualizationService.load')
      .and.returnValue($q.when('visualizations'));
  }));

  describe('#initialize', () => {
    beforeEach(() => {
      QueryLoader.initialize();
    });

    it('a query object is constructed', () => {
      expect(Query).toHaveBeenCalled();
    });

    it('a query versions object is constructed', () => {
      expect(QueryVersions).toHaveBeenCalled();
    });

    it('a results object is constructed', () => {
      expect(Results).toHaveBeenCalled();
    });

    it('sets queryId from the routeParams', () => {
      expect(QueryLoader.queryId).toBe(1);
    });

    it('sets queryVersionId from the routeParams', () => {
      expect(QueryLoader.queryVersionId).toBe(2);
    });

    describe('#load', () => {
      beforeEach(() => {
        QueryLoader.load();
        digest();
      });

      it('calls query.initItem', () => {
        expect(query.initItem).toHaveBeenCalledWith(1, 2);
      });

      it('calls queryVersions.initCollection', () => {
        expect(queryVersions.initCollection).toHaveBeenCalledWith(1);
      });

      it('calls results.initCollection', () => {
        expect(results.initCollection).toHaveBeenCalledWith({
          query_id: 1,
          query_version_id: 2
        });
      });

      it('calls VisualizationService.load', () => {
        expect(VisualizationService.load).toHaveBeenCalledWith(1, 2);
      });
    });
  });
});
