'use strict';

describe('Standard Model', () => {
  let StandardModel;
  let standardModel;
  let dirtyAwareModelSpies;
  let ActionHandler;
  let actionHandler;
  let newItem;

  beforeEach(module('modelGeneration'));

  beforeEach(module($provide => {
    let provide = ProvisionHelper.withProvide($provide);

    [ActionHandler, actionHandler]  = provide.classAndInstanceValue('ActionHandler', {
      wrapFetch: jasmine.createSpy('actionHandler.wrapFetch').and.callFake(f => f()),
      wrapDestroy: jasmine.createSpy('actionHandler.wrapDestroy').and.callFake(f => f()),
      wrapUpdate: jasmine.createSpy('actionHandler.wrapUpdate').and.callFake(f => f()),
      wrapCreate: jasmine.createSpy('actionHandler.wrapCreate').and.callFake(f => f()),
    });

    dirtyAwareModelSpies = provide.classSpyValue('DirtyAwareModel', SharedClassMocks.Model);
  }));

  beforeEach(inject(_StandardModel_ => {
    dirtyAwareModelSpies.fetch = jasmine.createSpy('dirtyAwareModel.fetch').and.returnValue('fetch');
    dirtyAwareModelSpies.destroy = jasmine.createSpy('dirtyAwareModel.destroy').and.returnValue('destroy');
    dirtyAwareModelSpies.update = jasmine.createSpy('dirtyAwareModel.update').and.returnValue('update');
    dirtyAwareModelSpies.create = jasmine.createSpy('dirtyAwareModel.create').and.returnValue('create');

    StandardModel = _StandardModel_;
    newItem = { color: 'orange' };
    standardModel = new StandardModel('orange', 'resource', newItem, 'dirtyAwareFields', 'dirtyAwareComparators');
  }));

  describe('on construction', () => {
    it('pass params to super class constructor properly', () => {
      expect(standardModel.modelConstructorArgs[0]).toBe('resource');
      expect(standardModel.modelConstructorArgs[1]).toBe('dirtyAwareFields');
      expect(standardModel.modelConstructorArgs[2]).toBe('dirtyAwareComparators');
    });
  });

  describe('#_newItem', () => {
    let ni;
    beforeEach(() => {
      ni = standardModel._newItem();
    });

    it('returns a copy of the newItem passed in to the constructor', () => {
      expect(ni).toEqual(newItem);
      expect(ni).not.toBe(newItem);
    });
  });

  describe('#fetch', () => {
    let params = { extraPulpy: 'yes' };
    let ret;
    beforeEach(() => {
      ret = standardModel.fetch(params);
    });

    it('delegates to super class using the proper actionHandler wrapping function', () => {
      expect(actionHandler.wrapFetch).toHaveBeenCalledWith(jasmine.any(Function));
      expect(dirtyAwareModelSpies.fetch).toHaveBeenCalledWith(params);
    });

    it('returns the correct value', () => {
      expect(ret).toBe('fetch');
    });
  });

  describe('#destroy', () => {
    let ret;
    beforeEach(() => {
      ret = standardModel.destroy();
    });

    it('delegates to super class using the proper actionHandler wrapping function', () => {
      expect(actionHandler.wrapDestroy).toHaveBeenCalledWith(jasmine.any(Function));
      expect(dirtyAwareModelSpies.destroy).toHaveBeenCalled();
    });

    it('returns the correct value', () => {
      expect(ret).toBe('destroy');
    });
  });

  describe('#update', () => {
    let params = { extraPulpy: 'yes' };
    let ret;
    beforeEach(() => {
      ret = standardModel.update(params);
    });

    it('delegates to super class using the proper actionHandler wrapping function', () => {
      expect(actionHandler.wrapUpdate).toHaveBeenCalledWith(jasmine.any(Function));
      expect(dirtyAwareModelSpies.update).toHaveBeenCalledWith(params);
    });

    it('returns the correct value', () => {
      expect(ret).toBe('update');
    });
  });

  describe('#create', () => {
    let params = { extraPulpy: 'yes' };
    let ret;
    beforeEach(() => {
      ret = standardModel.create(params);
    });

    it('delegates to super class using the proper actionHandler wrapping function', () => {
      expect(actionHandler.wrapCreate).toHaveBeenCalledWith(jasmine.any(Function));
      expect(dirtyAwareModelSpies.create).toHaveBeenCalledWith(params);
    });

    it('returns the correct value', () => {
      expect(ret).toBe('create');
    });
  });
});
