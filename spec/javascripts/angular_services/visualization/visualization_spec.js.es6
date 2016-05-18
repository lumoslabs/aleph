'use strict';

describe('Visualization', () => {
  let Visualization;
  let visualization;
  let ModelManager;
  let baseModelSpies;
  let digest;

  beforeEach(module('alephServices'));

  beforeEach(module($provide => {
    let provide = ProvisionHelper.withProvide($provide);

    baseModelSpies = {};
    ModelManager = provide.value('ModelManager', SharedMocks.ModelManager(SharedClassMocks.Model(baseModelSpies)));
  }));

  beforeEach(inject((_Visualization_, $q, $rootScope) => {
    digest = () => { $rootScope.$digest(); };

    Visualization = _Visualization_;
    visualization = new Visualization();

    baseModelSpies.initItem = jasmine.createSpy('dirtyAwareModelSpies.initItem')
      .and.returnValue($q.reject('initItem failed!'));
    baseModelSpies.update = jasmine.createSpy('dirtyAwareModelSpies.update')
      .and.returnValue($q.reject('update failed!'));
    baseModelSpies.create = jasmine.createSpy('dirtyAwareModelSpies.update')
      .and.returnValue($q.reject('create failed!'));
    baseModelSpies.destroy = jasmine.createSpy('dirtyAwareModelSpies.destroy')
      .and.returnValue($q.when({ id: 666 }));
  }));

  describe('on construction', () => {
    it('a visualization base class is requested from the manager', () => {
      expect(ModelManager.forModelName).toHaveBeenCalledWith('visualization');
    });
  });

  describe('#destroy', () => {
    beforeEach(() => {
      visualization.destroy();
    });

    it('delegates to dirtyAwareModel.initItem', () => {
      expect(baseModelSpies.destroy).toHaveBeenCalled();
    });

    describe('on response', () => {
      beforeEach(() => {
        digest();
      });

      it('calls initItem', () => {
        expect(baseModelSpies.initItem).toHaveBeenCalled();
      });
    });
  });

  describe('#save', () => {
    describe('when item is persisted', () => {
      let updateItem = { id: 1, title: 'myViz' };
      beforeEach(() => {
        visualization.isPersisted = jasmine.createSpy('visualization.isPersisted').and.returnValue(true);
        visualization.item = updateItem;
        visualization.save(1, 2);
      });

      it('delegates to dirtyAwareModel.update', () => {
        expect(baseModelSpies.update).toHaveBeenCalledWith(updateItem);
      });
    });

    describe('when item is not persisted', () => {
      beforeEach(() => {
        visualization.isPersisted = jasmine.createSpy('visualization.isPersisted').and.returnValue(false);
        visualization.item = { title: 'myViz' };
        visualization.save(1, 2);
      });

      it('delegates to dirtyAwareModel.create', () => {
        expect(baseModelSpies.create).toHaveBeenCalledWith({ query_id: 1, query_version_id: 2, title: 'myViz' });
      });
    });
  });

});
