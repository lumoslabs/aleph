!(angular => {
  'use strict';

  class ModelManager {

    constructor(ModelFactory, ResourceFactory, ModelDefinitions) {
      this._ModelFactory = ModelFactory;
      this._ResourceFactory = ResourceFactory;
      this._definitions = ModelDefinitions;
      this._resources = {};
      this._modelClasses = {};
      this._collectionModelClasses = {};
    }

    forModelName(name) {
      let definition = this._definitions[name];
      let resource = this._loadResource(name, definition.resource);

      return {
        resource: () => resource,
        modelClass: () => {
          return this._loadModelClass(name, definition.newItem, resource, definition.options);
        },
        collectionClass: Model => {
          return this._loadCollectionModelClass(pluralize.plural(name), Model, resource);
        }
      };
    }

    // private methods

    _loadCollectionModelClass(name, Model, resource) {
      return this._load(
        this._collectionModelClasses,
        name,
        this._ModelFactory.makeCollectionModel,
        this._ModelFactory,
        name,
        Model,
        resource
      );
    }

    _loadModelClass(name, newItem, resource, options) {
      return this._load(
        this._modelClasses,
        name,
        this._ModelFactory.makeModel,
        this._ModelFactory,
        name,
        newItem,
        resource,
        options
      );
    }

    _loadResource(name, resourceArgs) {
      let resourceName = this._capitalize(name) + 'Resource';
      return this._load(
        this._resources,
        resourceName,
        this._ResourceFactory.make,
        this._ResourceFactory,
        resourceArgs.path,
        resourceArgs.parameters,
        resourceArgs.actions
      );
    }

    _load(cache, key, f, context, ...args) {
      let o = cache[key];
      if (!_.exists(o)) {
        o = f.apply(context, args);
        cache[key] = o;
      }
      return o;
    }

    _capitalize(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
  }

  ModelManager.$inject = ['ModelFactory', 'ResourceFactory', 'ModelDefinitions'];
  angular.module('modelGeneration.modelManager', []).service('ModelManager', ModelManager);
}(angular));
