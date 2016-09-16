'use strict';

describe('Alert Show Controller', () => {
  let AlertShowController;
  let NavigationGuard;
  let navigationGuard;
  let Query;
  let query;
  let Alert;
  let alert;
  let DefaultAceConfigurator;
  let defaultAceConfigurator;
  let OpenReplService;
  let replQuery;
  let $routeParams;
  let $controller;
  let $scope;
  let digest;

  function makeController() {
    AlertShowController = $controller('AlertShowController', {
      $scope: $scope,
      NavigationGuard: NavigationGuard,
      Query: Query,
      Alert: Alert,
      DefaultAceConfigurator: DefaultAceConfigurator,
      OpenReplService: OpenReplService,
    });
  }

  beforeEach(module('alephControllers'));

  beforeEach(inject((_$controller_, $rootScope, $q, _$routeParams_) => {
    digest = () => { $rootScope.$digest(); };
    $routeParams = _$routeParams_;

    [NavigationGuard, navigationGuard] = TestUtils.classAndInstance('NavigationGuard', {});
    navigationGuard.registerOnBeforeUnload = jasmine.createSpy('registerOnBeforeUnload')
      .and.returnValue(navigationGuard);
    navigationGuard.registerLocationChangeStart = jasmine.createSpy('registerLocationChangeStart')
      .and.returnValue(navigationGuard);

    [Query, query] = TestUtils.classAndInstance('Query', {
      save: jasmine.createSpy('query.save').and.returnValue($q.when({ id: 666 })),
      initItem: jasmine.createSpy('query.initItem').and.returnValue($q.when({}))
    });

    [Alert, alert] = TestUtils.classAndInstance('Alert', {
      save: jasmine.createSpy('alert.save').and.returnValue($q.when({})),
      initItem: jasmine.createSpy('alert.initItem').and.returnValue($q.when({ query_id: 10 }))
    });
    alert.item = {};

    [DefaultAceConfigurator, defaultAceConfigurator] = TestUtils.classAndInstance('DefaultAceConfigurator', {
      readOnlyConfig: jasmine.createSpy('defaultAceConfigurator.readOnlyConfig')
    });

    // repl stuff
    replQuery = {
      item: {
        title: 'some query title',
        tags: []
      },
      save: jasmine.createSpy('replQuery.save').and.returnValue({})
    };
    OpenReplService = {
      open: jasmine.createSpy('OpenReplService.open').and.returnValue($q.when(replQuery))
    };

    $scope = {};
    $controller = _$controller_;
    makeController();
  }));

  describe('on initialization', () => {

    it('constructs a query', () => {
      expect(Query).toHaveBeenCalled();
    });

    it('constructs an alert', () => {
      expect(Alert).toHaveBeenCalled();
    });

    it('configures NavigationGuard', () => {
      expect(NavigationGuard).toHaveBeenCalledWith($scope);
      expect(navigationGuard.registerOnBeforeUnload).toHaveBeenCalled();
      expect(navigationGuard.registerLocationChangeStart).toHaveBeenCalled();
    });

    describe('when $routeParams.alertId is "new"', () => {
      beforeEach(() => {
        $routeParams.alertId = 'new';
        makeController();
      });

      it('initiates a blank alert item', () => {
        expect(alert.initItem).toHaveBeenCalled();
      });

      describe('on alert init success', () => {
        beforeEach(() => {
          digest();
        });

        it('initiates a blank query item', () => {
          expect(query.initItem).toHaveBeenCalled();
        });

        it('calls OpenReplService.open with skipSave == true', () => {
          expect(OpenReplService.open.calls.argsFor(0)[0]).toEqual({ skipSave: true });
        });

        it('sets alert.item.query_title from the repl query.item.title', () => {
          expect(alert.item.query_title).toEqual(replQuery.item.title);
        });

        it('adds alert-query to query tags', () => {
          expect(replQuery.item.tags).toContain('alert-query');
        });
      });
    });

    describe('when $routeParams.alertId is not "new"', () => {
      beforeEach(() => {
        $routeParams.alertId = 1;
        makeController();
        digest();
      });

      it('initiates the alert item from the server', () => {
        expect(alert.initItem).toHaveBeenCalledWith(1);
      });

      it('initiates the query item from the server', () => {
        expect(query.initItem).toHaveBeenCalledWith(10, 'latest');
      });

      it('OpenReplService.open is NOT called', () => {
        expect(OpenReplService.open).not.toHaveBeenCalled();
      });
    });
  });

  describe('#togglePaused', () => {
    it('sets the status to paused if it is not already paused', () => {
      alert.item.status = 'whatever';
      AlertShowController.togglePaused();

      expect(alert.item.status).toBe('Paused');
    });

    it('sets the status to pending if it is already paused', () => {
      alert.item.status = 'Paused';
      AlertShowController.togglePaused();

      expect(alert.item.status).toBe('Pending');
    });

    it('initiates saving of the item', () => {
      AlertShowController.togglePaused();

      expect(alert.save).toHaveBeenCalled();
    });
  });

  describe('when alert is not persisted', () => {
    beforeEach(() => {
      spyOn(AlertShowController, 'isPersisted').and.returnValue(false);
    });

    describe('#saveAlert', () => {
      beforeEach(() => {
        AlertShowController.saveAlert();
      });

      it('calls query.save', () => {
        expect(query.save).toHaveBeenCalled();
      });

      describe('on respsonse', () => {
        beforeEach(() => {
          digest();
        });

        it("alert.item.query_id is populated with the saved query's id", () => {
          expect(alert.item.query_id).toBe(666);
        });

        it('calls alert.save', () => {
          expect(alert.save).toHaveBeenCalled();
        });
      });
    });
  });

  describe('when alert is already persisted', () => {
    beforeEach(() => {
      spyOn(AlertShowController, 'isPersisted').and.returnValue(true);
    });

    describe('#saveAlert', () => {
      beforeEach(() => {
        AlertShowController.saveAlert();
      });

      it('calls alert.save', () => {
        expect(alert.save).toHaveBeenCalled();
      });
    });
  });

  describe('#editAlert', () => {
    beforeEach(() => {
      AlertShowController.editAlert();
    });

    it('calls OpenReplService.open', () => {
      expect(OpenReplService.open).toHaveBeenCalledWith({ query: query });
    });

    describe('on successful exit from the repl', () => {
      beforeEach(() => {
        digest();
      });

      it('the repl query saves with the result id', () => {
        expect(replQuery.save).toHaveBeenCalled();
      });

      it('the repl query becomes the controllers query', () => {
        expect(replQuery).toBe(AlertShowController.query);
      });

      it('calls alert.save', () => {
        expect(alert.save).toHaveBeenCalled();
      });
    });
  });

  describe('#aceLoaded', () => {
    beforeEach(() => {
      AlertShowController.aceLoaded('editor');
    });

    it('calls DefaultAceConfigurator, passing in the editor object', () => {
      expect(DefaultAceConfigurator).toHaveBeenCalledWith('editor');
    });

    it('configures the editor read only', () => {
      expect(defaultAceConfigurator.readOnlyConfig).toHaveBeenCalled();
    });
  });
});
