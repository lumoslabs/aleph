'use strict';

describe('SnippetIndexController', () => {
  let SnippetIndexController;
  let snippets;
  let snippet;
  let NavigationGuard;
  let navigationGuard;
  let $scope;
  let ModelManager;

  beforeEach(module('alephControllers'));

  beforeEach(module($provide => {
    let provide = ProvisionHelper.withProvide($provide);
    snippet = {};
    snippets = {};
    ModelManager = provide.value(
      'ModelManager',
      SharedMocks.ModelManager(
        SharedClassMocks.Model(snippet),
        SharedClassMocks.CollectionModel(snippets)
      )
    );
  }));

  beforeEach(inject(($q, $controller) => {
    $scope = {};

    snippets.initCollection = jasmine.createSpy('snippets.initCollection').and.returnValue($q.when('success'));
    snippet.initItem = jasmine.createSpy('snippet.initItem');

    [NavigationGuard, navigationGuard] = TestUtils.classAndInstance('NavigationGuard', {});
    navigationGuard.registerOnBeforeUnload = jasmine.createSpy('registerOnBeforeUnload')
      .and.returnValue(navigationGuard);
    navigationGuard.registerLocationChangeStart = jasmine.createSpy('registerLocationChangeStart')
      .and.returnValue(navigationGuard);

    SnippetIndexController = $controller('SnippetIndexController', {
      $scope: $scope,
      NavigationGuard: NavigationGuard
    });
  }));

  describe('on initialization', () => {

    it('calls snippets.initCollection', () => {
      expect(snippets.initCollection).toHaveBeenCalled();
    });

    it('configures NavigationGuard', () => {
      expect(NavigationGuard).toHaveBeenCalledWith($scope);
      expect(navigationGuard.registerOnBeforeUnload).toHaveBeenCalled();
      expect(navigationGuard.registerLocationChangeStart).toHaveBeenCalled();
    });
  });

  describe('#addNewSnippet', () => {
    beforeEach(() => {
      SnippetIndexController.snippets.collection = [];
      SnippetIndexController.addNewSnippet();
    });

    it('makes a new snippet and adds it into the collection', () => {
      expect(snippet.initItem).toHaveBeenCalled();
      expect(SnippetIndexController.snippets.collection.length).toEqual(1);
    });
  });
});
