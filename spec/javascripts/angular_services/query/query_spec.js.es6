'use strict';

describe('Query', () => {
  let Query;
  let query;
  let ParameterMethods;
  let AlertFlash;
  let standardModelSpies;
  let QueryResource;

  beforeEach(module('alephServices'));

  beforeEach(module($provide => {
    let provide = ProvisionHelper.withProvide($provide);

    ParameterMethods = provide.value('ParameterMethods', {
      detectParameters: jasmine.createSpy('ParameterMethods.detectParameters'),
      constructParameter: jasmine.createSpy('ParameterMethods.constructParameter').and.returnValue('parameter')
    });

    AlertFlash = provide.value('AlertFlash', SharedMocks.AlertFlash);
    standardModelSpies = provide.classSpyValue('StandardModel', SharedClassMocks.Model);
  }));

  beforeEach(inject((_Query_, _QueryResource_) => {

    Query = _Query_;
    query = new Query();
    QueryResource = _QueryResource_;

    standardModelSpies.fetch = jasmine.createSpy('dirtyAwareModel.fetch');
    standardModelSpies.save = jasmine.createSpy('dirtyAwareModel.save');
  }));

  describe('on construction', () => {
    it('passes resource and fields to super class constructor', () => {
      expect(query.modelConstructorArgs[0]).toBe('query');
      expect(query.modelConstructorArgs[1]).toBe(QueryResource);
    });
  });

  describe('#initItem', () => {
    beforeEach(() => {
      query.initItem(1, 2);
    });

    it('delegates to standardModelSpies.fetch', () => {
      expect(standardModelSpies.fetch).toHaveBeenCalledWith({ id: 1, version_id: 2 });
    });
  });

  describe('#save', () => {
    beforeEach(() => {
      query.item = { title: 'bleh' };
      query.save({ a: 'a' });
    });

    it('delegates to dirtyAwareModel.save', () => {
      expect(standardModelSpies.save).toHaveBeenCalledWith({ a: 'a' });
    });
  });

  describe('#detectParameters', () => {
    beforeEach(() => {
      query.item = {
        version: {
          body: 'meh',
          parameters: ['meh!']
        }
      };
      query.detectParameters();
    });

    it('delegates to ParameterMethods.detectParameters', () => {
      expect(ParameterMethods.detectParameters).toHaveBeenCalledWith('meh', ['meh!']);
    });
  });

  describe('#addParameter', () => {
    beforeEach(() => {
      query.item = {
        version: {
          parameters: []
        }
      };
      query.addParameter('a');
    });

    it('calls ParameterMethods.constructParameter', () => {
      expect(ParameterMethods.constructParameter).toHaveBeenCalledWith('a');
    });

    it('adds new parameter to list ', () => {
      expect(query.item.version.parameters[0]).toBe('parameter');
    });
  });
});
