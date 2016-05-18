'use strict';

describe('DirtyAwareModel', () => {
  let DirtyAwareModel;
  let dirtyAwareModel;

  beforeEach(module('models'));

  beforeEach(inject(_DirtyAwareModel_ => {
    DirtyAwareModel = _DirtyAwareModel_;
    dirtyAwareModel = new DirtyAwareModel({}, ['a', 'b']);

    dirtyAwareModel.modelState = {
      snapshotItem: jasmine.createSpy('modelState.snapshotItem'),
      isPristine: jasmine.createSpy('modelState.isPristine'),
      snapshot: {}
    };
  }));

  describe('when setting an item', () => {
    beforeEach(() => {
      dirtyAwareModel .item = { a: 'fua', b: 'buz' };
    });

    it('calls modelState.snapshotItem', () => {
      expect(dirtyAwareModel.modelState.snapshotItem).toHaveBeenCalledWith({ a: 'fua', b: 'buz' });
    });
  });

  describe('when item is persisted and not new', () => {
    beforeEach(() => {
      dirtyAwareModel.isNew = jasmine.createSpy('dirtyAwareModel.isNew').and.returnValue(false);
      dirtyAwareModel.isPersisted = jasmine.createSpy('dirtyAwareModel.isPersisted').and.returnValue(true);
      dirtyAwareModel.item = { id: 1, a: 'meh_a', b: 'meh_b' };
      dirtyAwareModel.isPristine();
    });

    it('#isPristine delegates item pristinity to modelState.isPristine', () => {
      expect(dirtyAwareModel.modelState.isPristine).toHaveBeenCalledWith({ id: 1, a: 'meh_a', b: 'meh_b' });
    });
  });

  describe('#revert', () => {
    beforeEach(() => {
      dirtyAwareModel.modelState.snapshot = { id: 1, a: 'meh_a', b: 'meh_b' };
      dirtyAwareModel.item = { id: 1, a: 'meh_a', b: 'meh_b' };
      dirtyAwareModel.item.a = 'some other value';

      dirtyAwareModel.revert();
    });

    it('reverts model item to what is in the modelState snapshot', () => {
      expect(dirtyAwareModel.item).toEqual({ id: 1, a: 'meh_a', b: 'meh_b' });
    });
  });
});
