'use strict';

describe('Model Factory', () => {
  let ModelManager;
  let ModelFactory;
  let ResourceFactory;
  let ModelDefinitions;
  let manager;

  beforeEach(module('modelGeneration'));

  beforeEach(module($provide => {
    ModelDefinitions = {
      novel: {
        newItem: {
          title: '',
          author: ''
        },
        options: {
          dirtyAwareFields: [ 'title ']
        },
        resource: {
          path: '/novel/:id.json',
          parameters: {id: '@id'},
          actions: {
            index: {
              method: 'GET',
              isArray: true,
              url: '/someIndexUrl'
            }
          }
        }
      },
    };
    $provide.value('ModelDefinitions', ModelDefinitions);

    ModelFactory = {
      makeModel: jasmine.createSpy('ModelFactory.makeModel')
        .and.returnValue('MyNovelModel'),
      makeCollectionModel: jasmine.createSpy('ModelFactory.makeCollectionModel')
        .and.returnValue('MyNovelCollectionModel')
    };
    $provide.value('ModelFactory', ModelFactory);

    ResourceFactory = {
      make: jasmine.createSpy('ResourceFactory.make').and.returnValue('MyNovelResource')
    };
    $provide.value('ResourceFactory', ResourceFactory);
  }));

  beforeEach(inject(_ModelManager_ => { ModelManager = _ModelManager_; }));

  describe('#forModelName', () => {
    beforeEach(() => {
      manager = ModelManager.forModelName('novel');
    });

    it('calls the ResourceFactory to make the resource given the model defintion', () => {
      expect(ResourceFactory.make).toHaveBeenCalledWith(
        ModelDefinitions.novel.resource.path,
        ModelDefinitions.novel.resource.parameters,
        ModelDefinitions.novel.resource.actions
      );
    });

    it('caches the resource with correct key', () => {
      expect(ModelManager._resources.NovelResource).toBe('MyNovelResource');
    });
  });

  describe('given a model name', () => {
    beforeEach(() => {
      manager = ModelManager.forModelName('novel');
    });

    describe('#makeModel', () => {
      let model;

      beforeEach(() => {
        model = manager.modelClass();
      });

      it('calls the ModelFactory to make the model given the model defintion', () => {
        expect(ModelFactory.makeModel).toHaveBeenCalledWith(
          'novel',
          ModelDefinitions.novel.newItem,
          'MyNovelResource',
          ModelDefinitions.novel.options
        );
      });

      it('caches the resource with correct key', () => {
        expect(ModelManager._modelClasses.novel).toBe('MyNovelModel');
      });

      it('get the model', () => {
        expect(model).toBe('MyNovelModel');
      });
    });

    describe('#makeCollectionModel', () => {
      let collection;
      beforeEach(() => {
        collection = manager.collectionClass('MyOtherNovelModel');
      });

      it('calls the ModelFactory to make the model given the model defintion', () => {
        expect(ModelFactory.makeCollectionModel).toHaveBeenCalledWith(
          'novels',
          'MyOtherNovelModel',
          'MyNovelResource'
        );
      });

      it('caches the resource with correct key', () => {
        expect(ModelManager._collectionModelClasses.novels).toBe('MyNovelCollectionModel');
      });

      it('get the model', () => {
        expect(collection).toBe('MyNovelCollectionModel');
      });
    });
  });
});
