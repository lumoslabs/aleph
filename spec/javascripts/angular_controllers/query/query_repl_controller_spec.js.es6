'use strict';

describe('Query REPL Controller', () => {
  let QueryReplController;
  let DefaultAceConfigurator;
  let defaultAceConfigurator;
  let query;
  let modalInstance;
  let hotkeys;
  let ResultRunner;
  let resultRunner;
  let Results;
  let results;
  let NavigationGuard;
  let navigationGuard;
  let defaultPreventer;
  let getResultCsv;
  let editor;
  let $scope;
  let digest;

  beforeEach(function (){
    module('alephControllers');
  });

  beforeEach(() => {
    inject(($controller, $rootScope) => {
      digest = () => { $rootScope.$digest(); };

      [ResultRunner, resultRunner] = TestUtils.classAndInstance('ResultRunner', {
        run: jasmine.createSpy('resultRunner.run')
      });

      [NavigationGuard, navigationGuard] = TestUtils.classAndInstance('NavigationGuard', {});
      navigationGuard.registerOnBeforeUnload = jasmine.createSpy('registerOnBeforeUnload')
        .and.returnValue(navigationGuard);
      navigationGuard.registerLocationChangeStart = jasmine.createSpy('registerLocationChangeStart')
        .and.returnValue(navigationGuard);
      navigationGuard.disable = jasmine.createSpy('disable');
      defaultPreventer = jasmine.createSpy('defaultPreventer');
      NavigationGuard.defaultPreventer = () => defaultPreventer;

      // mocks
      [DefaultAceConfigurator, defaultAceConfigurator] = TestUtils.classAndInstance('DefaultAceConfigurator', {
        snippetsConfig: jasmine.createSpy('defaultAceConfigurator.snippetsConfig')
      });

      [Results, results] = TestUtils.classAndInstance('Results', {});

      modalInstance = {
        close: jasmine.createSpy('modalInstance.close'),
        dismiss: jasmine.createSpy('modalInstance.dismiss')
      };

      hotkeys = {
        bindTo: angular.noop,
        add: angular.noop
      };
      spyOn(hotkeys, 'bindTo').and.returnValue(hotkeys);
      spyOn(hotkeys, 'add').and.returnValue(hotkeys);

      editor = {
        focus: jasmine.createSpy('Edtior.Focus'),
        setOptions: jasmine.createSpy('Edtior.setOptions'),
        commands: {
          addCommand: jasmine.createSpy('Editor.AddCommand'),
          bindKey: jasmine.createSpy('Editor.BindKey')
        }
      };

      query = {
        item: {
          title: 'mockQueryTitle',
          version: {
            body: 'mockQueryBody',
            parameters: []
          }
        }
      };

      $scope = {
        $on: jasmine.createSpy('$scope.$on')
      };

      getResultCsv = jasmine.createSpy('getResultCsv');

      QueryReplController = $controller('QueryReplController', {
        $scope: $scope,
        $uibModalInstance: modalInstance,
        NavigationGuard: NavigationGuard,
        query: query,
        DefaultAceConfigurator: DefaultAceConfigurator,
        hotkeys: hotkeys,
        Results: Results,
        getResultCsv: getResultCsv,
        ResultRunner: ResultRunner,
        KeyBindings: {
          saveQuery: new KeyBinding('Save Query', {mac: 'command+shift+s', win:'ctrl+shift+s'}),
          runQuery: new KeyBinding('Run Query', {mac: 'command+shift+k', win:'ctrl+shift+k'}),
          detectParameters: new KeyBinding('Detect Parameters', {mac: 'command+shift+p', win:'ctrl+shift+p'})
        }
      });
    });
  });

  describe('on initialization', () => {
    it('add keybindings', () => {
      expect(hotkeys.bindTo).toHaveBeenCalledWith($scope);
      expect(hotkeys.add.calls.count()).toEqual(3);
    });

    describe('on ace loaded', () => {
      beforeEach(() => {
        QueryReplController.aceLoaded(editor);
      });

      it('adds keybindings to ace editor', () => {
        expect(editor.commands.addCommand).toHaveBeenCalled();
        expect(editor.commands.bindKey).toHaveBeenCalled();
      });

      it('editor grabs focus', () => {
        expect(editor.focus).toHaveBeenCalled();
      });
    });

    it('navgiation guard is applied', () => {
      expect(NavigationGuard).toHaveBeenCalledWith($scope);
      expect(navigationGuard.registerOnBeforeUnload).toHaveBeenCalled();
      expect(navigationGuard.registerLocationChangeStart).toHaveBeenCalledWith(defaultPreventer);
    });

    it('construct Results', () => {
      expect(Results).toHaveBeenCalled();
    });

    it('construct a ResultRunner', () => {
      expect(ResultRunner).toHaveBeenCalledWith(query, results, {
        sandbox: true,
        enablePolling: true
      });
    });

    it('register de-polling callback on desotry', () => {
      expect($scope.$on).toHaveBeenCalledWith('$destroy', jasmine.any(Function));
    });
  });

  describe('#runQuery', () => {
    beforeEach(() => {
      QueryReplController.runQuery();
    });

    it('a new result model is constructed', () => {
      expect(resultRunner.run).toHaveBeenCalled();
    });
  });

  describe('when title has not be entered', () => {
    beforeEach(() => {
      query.item.title = '';
    });

    it('#validToSave returns false', () => {
      expect(QueryReplController.validToSave()).toBeFalsy();
    });

    it('#saveToolTipText returns message about needing to enter title', () => {
      expect(QueryReplController.saveToolTipText()).toBe('Please enter a query title');
    });
  });

  describe('#exit', () => {
    beforeEach(() => {
      QueryReplController.exit();
    });

    it('dismisses modalInstance', () => {
      expect(modalInstance.dismiss).toHaveBeenCalledWith('QueryReplExit');
    });

    it('explicity disable the navigation guard', () => {
      expect(navigationGuard.disable).toHaveBeenCalled();
    });
  });

  describe('#save', () => {
    describe('if a substitution value and results exist', () => {
      beforeEach(() => {
        results.collection = [{ item: 'result' }];
        query.item.version.parameters = [{name:'a', type: 'raw', default: undefined}];
        QueryReplController.resultRunner.substitutionValues = { 'a': 1 };
        QueryReplController.save();
      });

      it('sets parameter default value if a substitution value exists', () => {
        expect(query.item.version.parameters[0].default).toBe(1);
      });

      it('passes the last result into the $modalInstance.close', () => {
        expect(modalInstance.close).toHaveBeenCalledWith({ query: query, result: 'result' });
      });

      it('explicity disable the navigation guard', () => {
        expect(navigationGuard.disable).toHaveBeenCalled();
      });
    });
  });

  describe('#getCsv', () => {
    beforeEach(() => {
      QueryReplController.getCsv(100);
    });

    it('delegates to getResultCsv', () => {
      expect(getResultCsv).toHaveBeenCalledWith(100);
    });

    it('sets downloading flag to true', () => {
      expect(QueryReplController.downloadFlag).toBeTruthy();
    });
  });
});
