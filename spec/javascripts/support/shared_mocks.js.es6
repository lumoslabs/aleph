'use strict';

// often used spying protocols
const SharedSpies = {
  spyOnNavigationGuard(NavigationGuard) {
    return TestUtils.spyAndReturn(NavigationGuard, (NavigationGuard) => {
      spyOn(NavigationGuard, 'bindTo').and.returnValue(NavigationGuard);
      spyOn(NavigationGuard, 'registerOnBeforeUnload').and.returnValue(NavigationGuard);
      spyOn(NavigationGuard, 'registerLocationChangeStart').and.returnValue(NavigationGuard);
    });
  },
  spyOnQueryHandler(QueryHandler) {
    spyOn(QueryHandler, 'handleReplExit').and.callFake(o => o);
    spyOn(QueryHandler, 'navigateToLatestVersion').and.callFake(o => o);
    spyOn(QueryHandler, 'navigateToIndex').and.callFake(o => o);
    spyOn(QueryHandler, 'success').and.callFake(o => o);
  }
};

// often used mocks
const SharedMocks = {
  AlertFlash: {
    emitError: jasmine.createSpy('AlertFlash.emitError'),
    emitInfo: jasmine.createSpy('AlertFlash.emitInfo')
  },

  ModelManager: (ModelClass, CollectionModelClass, resource) => {
    return {
      forModelName: jasmine.createSpy('ModelManager.forModelName').and.returnValue({
        modelClass: () => ModelClass,
        collectionClass: () => CollectionModelClass,
        resource: () => resource
      })
    };
  }
};

// These represent common interface that are often used as super classes
const SharedClassMocks = {
  CollectionModel: (spyObj) => class {
    constructor(...args) {
      this.collectionModelConstructorArgs = args;
    }

    initCollection(args) {
      return spyObj.initCollection(args);
    }

    save(saveArgs, initArgs) {
      return spyObj.save(saveArgs, initArgs);
    }
  },

  Model: (spyObj) => class {
    constructor(...args) {
      this.modelConstructorArgs = args;
    }

    initItem(args) {
      return spyObj.initItem(args);
    }

    save(args) {
      return spyObj.save(args);
    }

    fetch(args) {
      return spyObj.fetch(args);
    }

    create(args) {
      return spyObj.create(args);
    }

    update(args) {
      return spyObj.update(args);
    }

    destroy(args) {
      return spyObj.destroy(args);
    }
  }
};
