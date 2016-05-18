'use strict';

describe('Result', () => {
  let ResultPoller;
  let Result;
  let result;
  let baseModelSpies;
  let ModelManager;
  let digest;
  let callback;

  beforeEach(module('alephServices'));

  beforeEach(module($provide => {
    let provide = ProvisionHelper.withProvide($provide);
    baseModelSpies = {};
    ModelManager = provide.value('ModelManager', SharedMocks.ModelManager(SharedClassMocks.Model(baseModelSpies)));
    ResultPoller = provide.value('ResultPoller', jasmine.createSpy('ResultPoller'));
  }));

  beforeEach(inject((_Result_, $rootScope, $q) => {

    callback = jasmine.createSpy('callback');

    Result = _Result_;
    result = new Result();
    digest = () => { $rootScope.$digest(); };

    baseModelSpies.create = jasmine.createSpy('modelBaseSpies.create')
      .and.returnValue($q.when('newResult'));
  }));

  describe('on construction', () => {
    it('a result base class is requested from the manager', () => {
      expect(ModelManager.forModelName).toHaveBeenCalledWith('result');
    });

    it('construct a poller', () => {
      expect(ResultPoller).toHaveBeenCalled();
    });
  });

  describe('#save', () => {
    beforeEach(() => {
      result.save(1, 2, { some: 'options' }).then(callback);
    });

    it('creates params and calls modelBase.create', () => {
      expect(baseModelSpies.create).toHaveBeenCalledWith({
        query_id: 1,
        query_version_id: 2,
        some: 'options'
      });
    });

    describe('on success', () => {
      beforeEach(() => {
        digest();
      });

      it('passes the new result to the callback', () => {
        expect(callback).toHaveBeenCalledWith('newResult');
      });
    });
  });
});
