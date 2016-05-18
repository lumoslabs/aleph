'use strict';

describe('SchemaColumn', () => {
  let SchemaColumn;
  let column;
  let SchemaCommentResource;
  let digest;
  let ModelState;
  let modelState;
  let AlertFlash;

  beforeEach(module('alephServices'));

  beforeEach(module($provide => {
    let provide = ProvisionHelper.withProvide($provide);
    AlertFlash = provide.value('AlertFlash', SharedMocks.AlertFlash);

    [ModelState, modelState] = provide.classAndInstanceValue('ModelState', {
      snapshotItem: jasmine.createSpy('modelState.snapshotItem'),
      isPristine: jasmine.createSpy('modelState.isPristine')
    });
  }));

  beforeEach(inject((_SchemaColumn_, _SchemaCommentResource_, $q, $rootScope) => {

    SchemaCommentResource = _SchemaCommentResource_;
    spyOn(SchemaCommentResource, 'update').and.returnValue({ $promise: $q.reject('update failed!')});
    spyOn(SchemaCommentResource, 'create').and.returnValue({ $promise: $q.reject('create failed!')});

    SchemaColumn = _SchemaColumn_;
    column = new SchemaColumn();

    digest = () => { $rootScope.$digest(); };
  }));

  describe('on construction', () => {
    it('ModelState is constructed', () => {
      expect(ModelState).toHaveBeenCalledWith(['comment_text']);
    });
  });

  describe('when setting an item', () => {
    beforeEach(() => {
      column.item = { a: 'fua', b: 'buz' };
    });

    it('calls modelState.snapshotItem', () => {
      expect(modelState.snapshotItem).toHaveBeenCalledWith({ a: 'fua', b: 'buz' });
    });
  });

  describe('when item is persisted and not new', () => {
    beforeEach(() => {
      column.isNew = jasmine.createSpy('column.isNew').and.returnValue(false);
      column.isPersisted = jasmine.createSpy('column.isPersisted').and.returnValue(true);
      column.item = { id: 1, a: 'meh_a', b: 'meh_b' };
      column.isPristine();
    });

    it('#isPristine delegates item pristinity to modelState.isPristine', () => {
      expect(modelState.isPristine).toHaveBeenCalledWith({ id: 1, a: 'meh_a', b: 'meh_b' });
    });
  });

  describe('#save', () => {
    beforeEach(() => {
      spyOn(column, '_toCommentObject').and.returnValue({ id: 1, no: 'comment' });
    });

    describe('when item is persisted', () => {
      beforeEach(() => {
        column.isPersisted = jasmine.createSpy('column.isPersisted').and.returnValue(true);
        column.save();
      });

      it('delegates to SchemaCommentResource.update', () => {
        expect(SchemaCommentResource.update).toHaveBeenCalledWith({ id: 1, no: 'comment' });
      });

      describe('on error', () => {
        beforeEach(() => {
          digest();
        });

        it('AlertFlash.emitError will be called', () => {
          expect(AlertFlash.emitError).toHaveBeenCalledWith('Failed to save comment, id = 1', 'update failed!');
        });
      });
    });

    describe('when item is not persisted and dirty', () => {
      beforeEach(() => {
        column.isPersisted = jasmine.createSpy('column.isPersisted').and.returnValue(false);
        modelState.isDirty = jasmine.createSpy('modelState.isDirty').and.returnValue(true);
        column.save();
      });

      it('delegates to SchemaCommentResource.create', () => {
        expect(SchemaCommentResource.create).toHaveBeenCalledWith({ id: 1, no: 'comment' });
      });

      describe('on error', () => {
        beforeEach(() => {
          digest();
        });

        it('AlertFlash.emitError will be called', () => {
          expect(AlertFlash.emitError).toHaveBeenCalledWith('Failed to save comment, id = 1', 'create failed!');
        });
      });
    });
  });
});
