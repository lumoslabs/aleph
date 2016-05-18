'use strict';

describe('Model Factory', () => {
  let ModelFactory;

  beforeEach(module('modelGeneration'));

  beforeEach(module($provide => {
    let provide = ProvisionHelper.withProvide($provide);
    provide.classSpyValue('StandardModel', SharedClassMocks.Model);
    provide.classSpyValue('StandardCollectionModel', SharedClassMocks.CollectionModel);
  }));

  beforeEach(inject(_ModelFactory_ => {
    ModelFactory = _ModelFactory_;
  }));

  describe('#makeCollectionModel', () => {
    let collectionModel;
    beforeEach(() => {
      let CollectionModel = ModelFactory.makeCollectionModel('cars', 'Model', 'resource');
      collectionModel = new CollectionModel();
    });

    it('a standard collection model is constructed properly', () => {
      expect(collectionModel.collectionModelConstructorArgs[0]).toBe('cars');
      expect(collectionModel.collectionModelConstructorArgs[1]).toBe('resource');
      expect(collectionModel.collectionModelConstructorArgs[2]).toBe('Model');
    });
  });

  describe('#makeModel', () => {
    let model;
    beforeEach(() => {
      let Model = ModelFactory.makeModel('car', { meh: 'meh' }, 'resource');
      model = new Model();
    });

    it('a standard  model is constructed properly', () => {
      expect(model.modelConstructorArgs[0]).toBe('car');
      expect(model.modelConstructorArgs[1]).toBe('resource');
      expect(model.modelConstructorArgs[2]).toEqual({ meh: 'meh' });
      expect(model.modelConstructorArgs[3]).toEqual([ 'meh' ]);
      expect(model.modelConstructorArgs[4]).toBe(undefined);
    });
  });

});
