'use strict';

describe('Pagination', () => {
  let Pagination;
  let pagination;
  let resourceActionSpy;
  let resourceActionSuccess;
  let MockModel;
  let modelInternalizeSpy;
  let spinnerOnSpy;
  let spinnerOffSpy;
  let lock;
  let digest;
  let CollectionDirtyAwareness;
  let collectionDirtyAwareness;

  function expectCollectionToContainClass(className, collection) {
    expect(collection[0].constructor.name).toEqual(className);
  }

  function initExpectations() {
    // expectations for the pagination._init method
    it('collection should be an empty array', () => {
      expect(pagination.collection).toEqual([]);
    });

    it('construct an instance of a CollectionDirtyAwareness', () => {
      expect(CollectionDirtyAwareness).toHaveBeenCalledWith(jasmine.any(Function));
    });

    it('sets internal inital values', () => {
      expect(pagination._offset).toEqual(0);
      expect(pagination._done).toEqual(false);
    });

    it('call spinner on', () => {
      expect(spinnerOnSpy).toHaveBeenCalled();
    });
  }

  beforeEach(module('alephServices'));

  beforeEach(module($provide => {
    let provide = ProvisionHelper.withProvide($provide);

    [CollectionDirtyAwareness, collectionDirtyAwareness] = provide.classAndInstanceValue('CollectionDirtyAwareness', {
      dirtyItems: jasmine.createSpy('mockCollectionDirtyAwareness.dirtyItems'),
      isDirty: jasmine.createSpy('mockCollectionDirtyAwareness.isDirty'),
      isPristine: jasmine.createSpy('mockCollectionDirtyAwareness.isPristine'),
      revert: jasmine.createSpy('mockCollectionDirtyAwareness.revert')
    });
  }));

  beforeEach(inject((_Pagination_, $q, $lock, $rootScope) => {
    digest = () => { $rootScope.$digest(); };

    lock = $lock;
    spyOn(lock, 'tryWithLockAsync').and.callThrough();

    spinnerOnSpy = jasmine.createSpy('spinnerOnSpy');
    spinnerOffSpy = jasmine.createSpy('spinnerOffSpy');

    resourceActionSpy = jasmine.createSpy('resource.paginationAction')
      .and.callFake((params, success) => {
        resourceActionSuccess = {
          withItems: () => success([{ id: 1, a: 'a' }, { id: 2, a: 'b' }, { id: 3, a: 'c' }]),
          withNoItems: () => success([])
        };
       });

    modelInternalizeSpy = jasmine.createSpy('model.internalize');
    MockModel = class MockModel {
      constructor() {
        this.internalize = modelInternalizeSpy;
      }
    };

    Pagination = _Pagination_;
    pagination = new Pagination('Foo', resourceActionSpy, MockModel, {
      initialSearch: 'bar',
      initialSort: 'x',
      spinnerOn: spinnerOnSpy,
      spinnerOff: spinnerOffSpy,
      additionalParams: { random: 'parameter' }
    });
  }));

  describe('on construction', () => {
    initExpectations();

    it('sort_descending should be defaulted to true', () => {
      expect(pagination._sortDescending).toBeTruthy();
    });
  });

  describe('#reload', () => {
    beforeEach(() => {
      spyOn(pagination, '_fetch');
      pagination.reload();
    });

    initExpectations();

    it('call #_fetch', () => {
      expect(pagination._fetch).toHaveBeenCalled();
    });
  });

  describe('dirty awareness', () => {
    beforeEach(() => {
      pagination.dirtyItems();
      pagination.isDirty();
      pagination.isPristine();
      pagination.revert();
    });

    it('is delegated to CollectionDirtyAwareness', () => {
      expect(collectionDirtyAwareness.dirtyItems).toHaveBeenCalled();
      expect(collectionDirtyAwareness.isDirty).toHaveBeenCalled();
      expect(collectionDirtyAwareness.isPristine).toHaveBeenCalled();
      expect(collectionDirtyAwareness.revert).toHaveBeenCalled();
    });
  });

  describe('#fetch', () => {

    describe('when pagination._done is false', () => {
      beforeEach(() => {
        pagination._done = false;
        pagination._offset = 1;
        pagination._limit = 100;

        pagination.fetch();
      });

      it('requests data in a lock', () => {
        expect(lock.tryWithLockAsync).toHaveBeenCalled();
      });

      it('requests data with the proper parameters', () => {
        expect(resourceActionSpy.calls.argsFor(0)[0]).toEqual({
          offset: 1,
          limit: 100,
          search: 'bar',
          sort_by: 'x',
          sort_descending: true,
          random: 'parameter'
        });
      });

      describe('on response', () => {
        describe('which has items', () => {
          beforeEach(() => {
            resourceActionSuccess.withItems();
          });

          it('makes inidivual models from response items and adds them to pagination.collection', () => {
            expect(modelInternalizeSpy.calls.count()).toEqual(3);
            expect(pagination.collection.length).toEqual(3);
            expectCollectionToContainClass('MockModel', pagination.collection);
          });

          it('increment offset', () => {
            expect(pagination._offset).toEqual(2);
          });

          it('turn spinner off', () => {
            expect(spinnerOffSpy).toHaveBeenCalled();
          });
        });

        describe('which has no items', () => {
          beforeEach(() => {
            resourceActionSuccess.withNoItems();
          });

          it('pagination.s_done is set to true', () => {
            expect(pagination._done).toBeTruthy();
          });

          it('turn spinner off', () => {
            expect(spinnerOffSpy).toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe('#save', () => {
    let model;
    beforeEach(() => {
      model = { save: jasmine.createSpy('model.save') };
      spyOn(pagination, 'dirtyItems').and.returnValue([model]);
      pagination.save({ a: 'a' });
    });

    it('delegates saving to each dirty models save method with the save parameters', () => {
      expect(model.save).toHaveBeenCalledWith({ a: 'a' });
    });
  });

  describe('#toggleSortOrder', () => {
    it('works correctly', () => {
      pagination._sortDescending = false;
      pagination.toggleSortOrder();
      expect(pagination._sortDescending).toBeTruthy();
      pagination.toggleSortOrder();
      expect(pagination._sortDescending).toBeFalsy();

    });
  });
});
