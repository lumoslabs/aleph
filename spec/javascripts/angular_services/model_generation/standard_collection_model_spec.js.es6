'use strict';

describe('Standard Model', () => {
  let StandardCollectionModel;
  let standardCollectionModel;
  let dirtyAwareCollectionModelSpies;
  let ActionHandler;
  let actionHandler;

  beforeEach(module('modelGeneration'));

  beforeEach(module($provide => {
    let provide = ProvisionHelper.withProvide($provide);

    [ActionHandler, actionHandler]  = provide.classAndInstanceValue('ActionHandler', {
      wrapInitCollection: jasmine.createSpy('actionHandler.wrapInitCollection').and.callFake(f => f()),
      wrapCollectionSave: jasmine.createSpy('actionHandler.wrapCollectionSave').and.callFake(f => f()),
    });

    dirtyAwareCollectionModelSpies = provide.classSpyValue(
      'DirtyAwareCollectionModel',
      SharedClassMocks.CollectionModel
    );
  }));

  beforeEach(inject(_StandardCollectionModel_ => {
    dirtyAwareCollectionModelSpies.initCollection = jasmine.createSpy('dirtyAwareCollectionModel.initCollection')
      .and.returnValue('initCollection');
    dirtyAwareCollectionModelSpies.save = jasmine.createSpy('dirtyAwareCollectionModel.save')
      .and.returnValue('save');

    StandardCollectionModel = _StandardCollectionModel_;
    standardCollectionModel = new StandardCollectionModel('oranges', 'resource', 'Orange');
  }));

  describe('on construction', () => {
    it('pass params to super class constructor properly', () => {
      expect(standardCollectionModel.collectionModelConstructorArgs[0]).toBe('resource');
      expect(standardCollectionModel.collectionModelConstructorArgs[1]).toBe('Orange');
    });
  });

  describe('#initCollection', () => {
    let params = { extraPulpy: 'yes' };
    let ret;
    beforeEach(() => {
      ret = standardCollectionModel.initCollection(params);
    });

    it('delegates to super class using the proper actionHandler wrapping function', () => {
      expect(actionHandler.wrapInitCollection).toHaveBeenCalledWith(jasmine.any(Function));
      expect(dirtyAwareCollectionModelSpies.initCollection).toHaveBeenCalledWith(params);
    });

    it('returns the correct value', () => {
      expect(ret).toBe('initCollection');
    });
  });

  describe('#save', () => {
    let initParams = { withOutSeeds: false };
    let saveParams = { extraPulpy: 'no' };
    let ret;
    beforeEach(() => {
      ret = standardCollectionModel.save(saveParams, initParams);
    });

    it('delegates to super class using the proper actionHandler wrapping function', () => {
      expect(actionHandler.wrapCollectionSave).toHaveBeenCalledWith(jasmine.any(Function));
      //expect(dirtyAwareCollectionModelSpies.save).toHaveBeenCalledWith(saveParams, initParams);
    });

    it('returns the correct value', () => {
      expect(ret).toBe('save');
    });
  });
});
