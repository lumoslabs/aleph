'use strict';

describe('QueryIndexController', () => {
  let QueryIndexController;
  let OpenReplService;
  let PaginationComponents;
  let paginationComponents;
  let SelectionTagInput;
  let selectionTagInput;
  let digest;
  let RoleModel;
  let TagResource;
  let QueryHandler;
  let Query;
  let QueryResource;
  let replSuccess;

  beforeEach(module('alephControllers'));

  beforeEach(() => {
    inject(($q, _$controller_, $rootScope, _RoleModel_, _TagResource_, _QueryHandler_,
      _Query_, _QueryResource_) => {
      digest = () => { $rootScope.$digest(); };

      Query = _Query_;
      QueryResource = _QueryResource_;

      QueryHandler = _QueryHandler_;
      SharedSpies.spyOnQueryHandler(QueryHandler);

      RoleModel = _RoleModel_;
      spyOn(RoleModel, 'initCollection');

      TagResource = _TagResource_;
      spyOn(TagResource, 'index').and.returnValue({ $promise: 'promise' });

      // mocks
      replSuccess = {
        query: {
          save: jasmine.createSpy('replQuery.save').and.returnValue({})
        },
        result: { id: 11 }
      };
      OpenReplService = {
        open: jasmine.createSpy('OpenReplService.open').and.returnValue($q.when(replSuccess))
      };

      [PaginationComponents, paginationComponents] = TestUtils.classAndInstance('PaginationComponents', {
        save: jasmine.createSpy('PaginationComponents.save').and.returnValue($q.when('whatever')),
        revert: jasmine.createSpy('PaginationComponents.revert'),
        reload: jasmine.createSpy('PaginationComponents.reload')
      });

      [SelectionTagInput, selectionTagInput] = TestUtils.classAndInstance('SelectionTagInput', {
        onSelection: jasmine.createSpy('SelectionTagInput.onSelection'),
      });

      QueryIndexController = _$controller_('QueryIndexController', {
        OpenReplService: OpenReplService,
        PaginationComponents: PaginationComponents,
        SelectionTagInput: SelectionTagInput,
      });
    });
  });

  describe('on construction', () => {
    it('make selection inputs', () => {
      expect(SelectionTagInput.calls.argsFor(0)[0]['itemField']).toEqual('tags');
      expect(SelectionTagInput.calls.argsFor(1)[0]['itemField']).toEqual('roles');
    });

    it('it constructs a PaginationComponents object', () => {
      expect(PaginationComponents).toHaveBeenCalledWith('Paginated Queries', QueryResource.index, Query);
    });

    it('initialize RoleModel', () => {
      expect(RoleModel.initCollection).toHaveBeenCalled();
    });
  });

  describe('#loadTags', () => {
    beforeEach(() => {
      QueryIndexController.loadTags('bleh');
    });

    it('delegates to TagResource.index', () => {
      expect(TagResource.index).toHaveBeenCalledWith({ search: 'bleh' });
    });
  });

  describe('#onSelection', () => {
    beforeEach(() => {
      QueryIndexController.onSelection();
    });

    it('delegates to selectionTagInput.onSelection for tags and roles', () => {
      expect(selectionTagInput.onSelection.calls.count()).toEqual(2);
    });
  });

  describe('#deselectAll', () => {
    let query = {};
    beforeEach(() => {
      spyOn(QueryIndexController, 'onSelection');
      QueryIndexController.selectedQueries = [query];
      QueryIndexController.deselectAll();
    });

    it('sets selected queries .selected property to false', () => {
      expect(query.selected).toBe(false);
    });

    it('truncates selectedQueries', () => {
      expect(QueryIndexController.selectedQueries.length).toEqual(0);
    });

    it('calls #onSelection to refigure selection', () => {
      expect(QueryIndexController.onSelection).toHaveBeenCalled();
    });
  });

  describe('#save', () => {
    beforeEach(() => {
      spyOn(QueryIndexController, 'deselectAll');
      QueryIndexController.save();
    });

    it('delegates to pagination.save', () => {
      expect(paginationComponents.save).toHaveBeenCalled();
    });

    describe('on response', () => {
      beforeEach(() => {
        digest();
      });

      it('deselects queries', () => {
        expect(QueryIndexController.deselectAll).toHaveBeenCalled();
      });

      it('reloads queries', () => {
        expect(paginationComponents.reload).toHaveBeenCalled();
      });
    });
  });

  describe('revert', () => {
    beforeEach(() => {
      spyOn(QueryIndexController, 'onSelection');
      QueryIndexController.revert();
    });

    it('delegates to paginationComponents.revert', () => {
      expect(paginationComponents.revert).toHaveBeenCalled();
    });

    it('calls #onSelection to refigure selection', () => {
      expect(QueryIndexController.onSelection).toHaveBeenCalled();
    });
  });

  describe('#openRepl', () => {
    beforeEach(() => {
      QueryIndexController.openRepl();
    });

    it('calls OpenReplService.open', () => {
      expect(OpenReplService.open).toHaveBeenCalled();
    });

    describe('on success from repl', () => {
      beforeEach(() => {
        digest();
      });

      it('calls displayHandlers.navigateToLatestVersion', () => {
        expect(QueryHandler.navigateToLatestVersion).toHaveBeenCalled();
      });

      it('call success displayHandler', () => {
        expect(QueryHandler.success).toHaveBeenCalled();
      });
    });
  });

});
