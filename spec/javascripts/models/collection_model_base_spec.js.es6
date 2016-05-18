'use strict';

describe('CollectionModelBase', () => {
  let CollectionModelBase;
  let collectionModel;
  let MockModel;
  let resource;
  let digest;
  let callback;
  let modelSaveSpy;
  let modelInternalizeSpy;

  function expectCollectionToContainClass(className, collection) {
    expect(collection[0].constructor.name).toEqual(className);
  }

  beforeEach(module('models'));

  beforeEach(inject((_CollectionModelBase_, $q, $rootScope) => {
    // mock resource
    let indexResponse = [{ id: 1, a: 'a' }, { id: 2, a: 'b' }, { id: 3, a: 'c' }];
    resource = {
      index: jasmine.createSpy('resource.index').and.returnValue({ $promise: $q.when(indexResponse)}),
    };

    // mock model
    modelSaveSpy = jasmine.createSpy('model.save').and.returnValue($q.when('model.save.response'));
    modelInternalizeSpy = jasmine.createSpy('model.internalize');

    MockModel = class MockModel {
      constructor() {
        this.internalize = modelInternalizeSpy;
        this.save = modelSaveSpy;
      }
    };

    CollectionModelBase = _CollectionModelBase_;
    collectionModel = new CollectionModelBase(resource, MockModel);

    digest = () => { $rootScope.$digest(); };
    callback = jasmine.createSpy('callback');
  }));

  describe('on construction', () => {
    it('collection should be empty array', () => {
      expect(collectionModel.collection).toEqual([]);
    });
  });

  describe('#internalize', () => {
    it('delegates internalization to individual model and sets collection as array of model objects', () => {
      collectionModel.internalize([{ id: 1 }, { id: 2 }]);

      expect(modelInternalizeSpy.calls.count()).toEqual(2);
      expect(collectionModel.collection.length).toEqual(2);
      expectCollectionToContainClass('MockModel', collectionModel.collection);
    });

    it('does not set collection if items is undefined', () => {
      collectionModel.internalize();

      expect(collectionModel.collection).toEqual([]);
    });

    it('empties the collection if return items is also empty', () => {
      collectionModel.collection = ['something'];
      collectionModel.internalize([]);

      expect(collectionModel.collection).toEqual([]);
    });

    it('does not set collection if items is not an array', () => {
      collectionModel.internalize(5);

      expect(collectionModel.collection).toEqual([]);
    });
  });

  describe('#initCollection', () => {
    beforeEach(() => {
      collectionModel.initCollection({ p: 'p' }).then(callback);
      digest();
    });

    it('calls resource.index', () => {
      expect(resource.index).toHaveBeenCalledWith({ p: 'p' });
    });

    it('internalizes the response as collection', () => {
      expect(modelInternalizeSpy.calls.count()).toEqual(3);
    });

    it('propagates response', () => {
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('#save', () => {
    beforeEach(() => {
      collectionModel.collection = ['1', '2'];
      spyOn(collectionModel, '_saveCollection');
      collectionModel.save('x','y');
    });

    it('it passes the collection to _saveCollection', () => {
      expect(collectionModel._saveCollection).toHaveBeenCalledWith('x', 'y', ['1', '2']);
    });
  });

  describe('#_saveCollection', () => {
    describe('for a persisted item', () => {
      let model;
      beforeEach(() => {
        spyOn(collectionModel, 'initCollection').and.callThrough();
        model = new MockModel();
        collectionModel._saveCollection({ a: 'a' }, { b: 'b' }, [model]).then(callback);
        digest();
      });

      it('delegates saving to each individual models save method with the save parameters', () => {
        expect(model.save).toHaveBeenCalledWith({ a: 'a' });
      });

      it('initCollection is called with initParams ', () => {
        expect(collectionModel.initCollection.calls.first().args[0]).toEqual({ b: 'b' });
      });

      it('propagates response from initCollection', () => {
        expect(callback).toHaveBeenCalled();
      });
    });
  });

  describe('#add', () => {
    let model;
    beforeEach(() => {
      model = collectionModel.add({ a: 'x' });
    });

    it('item is internalized by model', () => {
      expect(modelInternalizeSpy).toHaveBeenCalledWith({ a: 'x' });
    });

    it('model is added to collection', () => {
      expect(collectionModel.collection.length).toEqual(1);
      expectCollectionToContainClass('MockModel', collectionModel.collection);
    });

    it('returns the added model', () => {
      expect(model).toEqual(jasmine.any(Object));
    });
  });

  describe('#remove', () => {
    let removed;
    beforeEach(() => {
      let makeModelObj = id => { return { item: { id: id } }; };
      collectionModel.collection = [makeModelObj(123), makeModelObj(444)];
      removed = collectionModel.remove({ id: 123 });
    });

    it('item is removed by lookup by item.id', () => {
      expect(collectionModel.collection.length).toEqual(1);
      expect(collectionModel.collection[0]).toEqual({ item: { id: 444 } });
    });

    it('returns the removed element', () => {
      expect(removed).toEqual({ item: { id: 123 } });
    });
  });

  describe('#items', () => {
    beforeEach(() => {
      collectionModel.collection = [ { item: 'a'}, { item: 'b' }];
    });

    it('array of the items of the model', () => {
      expect(collectionModel.items()).toEqual([ 'a', 'b' ]);
    });
  });
});
