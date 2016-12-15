'use strict';

describe('ModelBase', () => {
  let ModelBase;
  let model;
  let resource;
  let q;
  let digest;
  let callback;

  beforeEach(module('models'));

  beforeEach(inject((_ModelBase_, $q, $rootScope) => {
    let resolveResource = value => { return { $promise: $q.when(value)}; };

    resource = {
      show: jasmine.createSpy('resource.show').and.returnValue(resolveResource({ id: 1, a: 1, b: 2 })),
      create: jasmine.createSpy('resource.create').and.returnValue(resolveResource({ id: 1, a: 1, b: 2 })),
      update: jasmine.createSpy('resource.update').and.returnValue(resolveResource({ id: 2, a: 3, b: 4 })),
      destroy: jasmine.createSpy('resource.destroy').and.returnValue(resolveResource({ id: 6, a: 6, b: 6 }))
    };

    ModelBase = _ModelBase_;
    model = new ModelBase(resource);

    q = $q;
    spyOn(q, 'when').and.callThrough();

    digest = () => { $rootScope.$digest(); };
    callback = jasmine.createSpy('callback');
  }));

  describe('on construction', () => {
    it('item should be empty hash', () => {
      expect(model.item).toEqual({});
    });
  });

  describe('when _newItem is not implemented', () => {
    it('#isNew() throws an exception', () => {
      expect(() => { model.isNew(); }).toThrow('#_newItem must be implemented in subclasses!');
    });
  });


  describe('#internalize', () => {
    it('sets the item if item passed in exists', () => {
      let i = { a: 'a', b: 'b' };
      model.internalize(i);
      expect(model.item).toBe(i);
    });

    it('blanks out the item if what is passed in does not exist', () => {
      model.item = { something: 'good' };
      model.internalize();
      expect(model.item).toEqual({});
    });
  });

  describe('#save', () => {
    describe('for a persisted item', () => {
      beforeEach(() => {
        spyOn(model, 'update');
        model.item = { id: 5, a: 5, b: 5 };
        model.save({ c: 'c' });
      });

      it('calls #update', () => {
        expect(model.update).toHaveBeenCalledWith({ id: 5, a: 5, b: 5, c: 'c' });
      });
    });

    describe('for an unpersisted item', () => {
      beforeEach(() => {
        spyOn(model, 'create');
        model.item = { a: 5, b: 5 };
        model.save({ c: 'c' });
      });

      it('calls #create', () => {
        expect(model.create).toHaveBeenCalledWith({ a: 5, b: 5, c: 'c' });
      });
    });
  });

  describe('#clone', () => {
    beforeEach(() => {
      spyOn(model, 'clone');
      model.item = { id: 1, otherAttribute: 'yeah' }
    });

    it('returns a clone with an undefined id'), () => {
        expect(model.clone).toEqual(new ModelBase(resource).internalize({ id: undefined, otherAttribute: 'yeah' }));
    }
  });

  describe('when _newItem is implemented', () => {
    beforeEach(() => {
      model._newItem = () => { return { a: '', b: ' '}; };
    });

    describe('#initItem', () => {
      describe('when requested with an id', () => {
        beforeEach(() => {
          spyOn(model, 'fetch');
          model.initItem(3);
        });

        it('calls #fetch', () => {
          expect(model.fetch).toHaveBeenCalledWith({ id: 3 });
        });
      });

      describe('when requested without an id', () => {
        beforeEach(() => {
          model.initItem();
        });

        it('calls q.when', () => {
          expect(q.when).toHaveBeenCalledWith(model._newItem());
        });
      });
    });

    describe('#isNew', () => {
      beforeEach(() => {
        model.item = model._newItem();
      });

      it('truthy when item equals _newItem()', () => {
        expect(model.isNew()).toBeTruthy();
      });
    });
  });

  describe('#create', () => {
    beforeEach(() => {
      model.create({ a: 1, b: 2 }).then(callback);
      digest();
    });

    it('calls resource.create', () => {
      expect(resource.create).toHaveBeenCalledWith({ a: 1, b: 2 });
    });

    it('sets the response as item', () => {
      expect(model.item).toEqual({ id: 1, a: 1, b: 2 });
    });

    it('propagates response item', () => {
      expect(callback).toHaveBeenCalledWith({ id: 1, a: 1, b: 2 });
    });
  });

  describe('#update', () => {
    beforeEach(() => {
      model.update({id: 2, a: 3, b: 4 }).then(callback);
      digest();
    });

    it('calls resource.update', () => {
      expect(resource.update).toHaveBeenCalledWith({ id: 2, a: 3, b: 4 });
    });

    it('sets the response as item', () => {
      expect(model.item).toEqual({ id: 2, a: 3, b: 4 });
    });

    it('propagates response item', () => {
      expect(callback).toHaveBeenCalledWith({ id: 2, a: 3, b: 4 });
    });
  });

  describe('#fetch', () => {
    beforeEach(() => {
      model.fetch({id: 1}).then(callback);
      digest();
    });

    it('calls resource.show', () => {
      expect(resource.show).toHaveBeenCalledWith({ id: 1 });
    });

    it('sets the response as item', () => {
      expect(model.item).toEqual({ id: 1, a: 1, b: 2 });
    });

    it('propagates response item', () => {
      expect(callback).toHaveBeenCalledWith({ id: 1, a: 1, b: 2 });
    });
  });

  describe('#destroy', () => {
    beforeEach(() => {
      model.item = { id: 1 };
      model.destroy({id: 1}).then(callback);
      digest();
    });

    it('calls resource.show', () => {
      expect(resource.destroy).toHaveBeenCalledWith({ id: 1 });
    });

    it('does NOT set the response as item', () => {
      expect(model.item).toEqual({ id: 1 });
    });

    it('propigates response item', () => {
      expect(callback).toHaveBeenCalledWith({ id: 6, a: 6, b: 6 });
    });
  });


});
