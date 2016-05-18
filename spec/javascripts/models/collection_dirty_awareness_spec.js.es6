'use strict';

describe('CollectionDirtyAwareness', () => {
  let CollectionDirtyAwareness;
  let collectionDirtyAwareness;

  beforeEach(module('models'));

  beforeEach(inject(_CollectionDirtyAwareness_ => {
    CollectionDirtyAwareness = _CollectionDirtyAwareness_;
  }));

  describe('#dirtyItems', () => {
    let mockModel;
    let mockModelDirty;

    beforeEach(() => {
      mockModel = { isDirty: jasmine.createSpy('model.isDirty').and.returnValue(false) };
      mockModelDirty = { isDirty: jasmine.createSpy('model.isDirty').and.returnValue(true) };
      collectionDirtyAwareness = new CollectionDirtyAwareness(() => [mockModel, mockModelDirty]);
    });

    it('only returns dirty items', () => {
      expect(collectionDirtyAwareness.dirtyItems()).toEqual([mockModelDirty]);
    });
  });

  describe('#revert', () => {
    let mockModel;

    beforeEach(() => {
      mockModel = { revert: jasmine.createSpy('model.revert') };
      collectionDirtyAwareness = new CollectionDirtyAwareness(() => [mockModel]);
      collectionDirtyAwareness.revert();
    });

    it('only returns dirty items', () => {
      expect(mockModel.revert).toHaveBeenCalled();
    });
  });
});
