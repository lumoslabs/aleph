'use strict';

describe('DirtyAwareCollectionModel', () => {
  let DirtyAwareCollectionModel;
  let dirtyAwareCollectionModel;

  // CollectionDirtyAwareness spies
  let CollectionDirtyAwareness;
  let collectionDirtyAwareness;

  beforeEach(module('models'));

  beforeEach(module($provide => {
    collectionDirtyAwareness = {
      dirtyItems: jasmine.createSpy('mockCollectionDirtyAwareness.dirtyItems'),
      isDirty: jasmine.createSpy('mockCollectionDirtyAwareness.isDirty'),
      isPristine: jasmine.createSpy('mockCollectionDirtyAwareness.isPristine'),
      revert: jasmine.createSpy('mockCollectionDirtyAwareness.revert')
    };

    CollectionDirtyAwareness = jasmine.createSpy('MockCollectionDirtyAwareness')
      .and.returnValue(collectionDirtyAwareness);

    $provide.value('CollectionDirtyAwareness', CollectionDirtyAwareness);
  }));

  beforeEach(inject(_DirtyAwareCollectionModel_ => {
    DirtyAwareCollectionModel = _DirtyAwareCollectionModel_;
    dirtyAwareCollectionModel = new DirtyAwareCollectionModel({},{});
  }));

  describe('on construction', () => {
    it('construct a CollectionDirtyAwareness with a function (which returns the models collection)', () => {
      expect(CollectionDirtyAwareness).toHaveBeenCalledWith(jasmine.any(Function));
    });
  });

  describe('dirty awareness', () => {
    beforeEach(() => {
      dirtyAwareCollectionModel.dirtyItems();
      dirtyAwareCollectionModel.isDirty();
      dirtyAwareCollectionModel.isPristine();
      dirtyAwareCollectionModel.revert();
    });

    it('is delegated to CollectionDirtyAwareness', () => {
      expect(collectionDirtyAwareness.dirtyItems).toHaveBeenCalled();
      expect(collectionDirtyAwareness.isDirty).toHaveBeenCalled();
      expect(collectionDirtyAwareness.isPristine).toHaveBeenCalled();
      expect(collectionDirtyAwareness.revert).toHaveBeenCalled();

    });
  });

  describe('#save', () => {
    beforeEach(() => {
      spyOn(dirtyAwareCollectionModel, 'dirtyItems').and.returnValue(['a', 'b']);
      spyOn(dirtyAwareCollectionModel, '_saveCollection');
      dirtyAwareCollectionModel.save('x','y');
    });

    it('it passes the dirtyItems to _saveCollection', () => {
      expect(dirtyAwareCollectionModel.dirtyItems).toHaveBeenCalled();
      expect(dirtyAwareCollectionModel._saveCollection).toHaveBeenCalledWith('x', 'y', ['a', 'b']);
    });
  });
});
