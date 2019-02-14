'use strict';

describe('QueryDetailsController', () => {
  let QueryDetailsController;
  let TagResource;
  let RoleModel;
  let OpenReplService;
  let DefaultAceConfigurator;
  let defaultAceConfigurator;
  let replSuccess;
  let QueryHandler;
  let query;
  let clonedQuery;
  let form;
  let digest;

  beforeEach(module('alephDirectives'));

  beforeEach(inject((_TagResource_, _QueryHandler_, _RoleModel_, $controller, $rootScope, $q) => {
    digest = () => { $rootScope.$digest(); };

    QueryHandler = _QueryHandler_;
    SharedSpies.spyOnQueryHandler(QueryHandler);

    TagResource = _TagResource_;
    spyOn(TagResource, 'index').and.returnValue({ $promise: 'promise' });

    RoleModel = _RoleModel_;
    spyOn(RoleModel, 'initCollection');

    replSuccess = {
      query: {
        save: jasmine.createSpy('replQuery.save').and.returnValue($q.when('replQuery.save.response'))
      },
      result: { id: 11 }
    };
    OpenReplService = {
      open: jasmine.createSpy('OpenReplService.open').and.returnValue($q.when(replSuccess))
    };

    [DefaultAceConfigurator, defaultAceConfigurator] = TestUtils.classAndInstance('DefaultAceConfigurator', {
      readOnlyConfig: jasmine.createSpy('defaultAceConfigurator.readOnlyConfig')
    });

    // Cloned query
    clonedQuery = {
      save: jasmine.createSpy('clonedQuery.save').and.returnValue($q.when('clonedQuery.save')),
      destroy: jasmine.createSpy('clonedQuery.save').and.returnValue($q.when('clonedQuery.destroy')),
      _item: { title: "Lol" }
    };

    // construct and set up controller
    query = {
      save: jasmine.createSpy('query.save').and.returnValue($q.when('query.save')),
      destroy: jasmine.createSpy('query.save').and.returnValue($q.when('query.destroy')),
      clone: jasmine.createSpy('query.clone').and.returnValue(clonedQuery)
    };

    form = {
      $setPristine: jasmine.createSpy('form.$setPristine')
    };

    QueryDetailsController = $controller('QueryDetailsController', {
      OpenReplService: OpenReplService,
      DefaultAceConfigurator: DefaultAceConfigurator
    }, {
      query: query,
      form: form
    });

    spyOn(QueryDetailsController, '_closeCommentDialog').and.callThrough();
    spyOn(QueryDetailsController, '_closeScheduleDialog').and.callThrough();
    spyOn(QueryDetailsController, '_closeDialogBoxes').and.callThrough();
  }));

  describe('on constructions', () => {
    it('calls RoleModel.initCollection', () => {
      expect(RoleModel.initCollection).toHaveBeenCalled();
    });
  });

  describe('#loadTags', () => {
    beforeEach(() => {
      QueryDetailsController.loadTags('bleh');
    });

    it('delegates to TagResource.index', () => {
      expect(TagResource.index).toHaveBeenCalledWith({ search: 'bleh' });
    });
  });

  describe('#updateTitle', () => {
    beforeEach(() => {
      query.isDirty = () => true;
      QueryDetailsController.updateTitle();
    });

    it('calls query.save and calls down the promise chain', () => {
      expect(query.save).toHaveBeenCalled();
    });

    describe('on success', () => {
      beforeEach(() => {
        digest();
      });

      it('reset the title form to pristine', () => {
        expect(form.$setPristine).toHaveBeenCalled();
      });

      it('flash success to user', () => {
        expect(QueryHandler.success).toHaveBeenCalled();
      });

      it('closes the comment dialog', () => {
        expect(QueryDetailsController._closeDialogBoxes).toHaveBeenCalled();
      });
    });
  });

  describe('#updateTagsAndRoles', () => {
    beforeEach(() => {
      query.isDirty = () => true;
      QueryDetailsController.updateTagsAndRoles();
    });

    it('calls query.save and calls down the promise chain', () => {
      expect(query.save).toHaveBeenCalled();
    });

    describe('on success', () => {
      beforeEach(() => {
        digest();
      });

      it('flash success to user', () => {
        expect(QueryHandler.success).toHaveBeenCalled();
      });

      it('closes the comment dialog', () => {
        expect(QueryDetailsController._closeDialogBoxes).toHaveBeenCalled();
      });
    });
  });

  describe('#updateCommentDialogAndClose', () => {
    beforeEach(() => {
      query.isDirty = () => true;
      QueryDetailsController.updateCommentDialogAndClose();
    });

    it('calls query.save and calls down the promise chain', () => {
      expect(query.save).toHaveBeenCalled();
    });

    describe('on success', () => {
      beforeEach(() => {
        digest();
      });

      it('flash success to user', () => {
        expect(QueryHandler.success).toHaveBeenCalled();
      });

      it('closes the comment dialog', () => {
        expect(QueryDetailsController._closeCommentDialog).toHaveBeenCalled();
      });
    });
  });

  describe('#updateScheduleDialogAndClose', () => {
    beforeEach(() => {
      query.isDirty = () => true;
      QueryDetailsController.updateScheduleDialogAndClose();
    });

    it('calls query.save and calls down the promise chain', () => {
      expect(query.save).toHaveBeenCalled();
    });

    describe('on success', () => {
      beforeEach(() => {
        digest();
      });

      it('flash success to user', () => {
        expect(QueryHandler.success).toHaveBeenCalled();
      });

      it('closes the comment dialog', () => {
        expect(QueryDetailsController._closeScheduleDialog).toHaveBeenCalled();
      });
    });
  });

  describe('#openRepl', () => {
    beforeEach(() => {
      QueryDetailsController.openRepl();
    });

    it('calls OpenReplService.open', () => {
      expect(OpenReplService.open).toHaveBeenCalledWith({ query: query });
    });

    describe('on success', () => {
      beforeEach(() => {
        digest();
      });

      it('navigates to the latest version', () => {
        expect(QueryHandler.navigateToLatestVersion).toHaveBeenCalled();
      });

      it('flash success to user', () => {
        expect(QueryHandler.success).toHaveBeenCalled();
      });

      it('closes the comment dialog', () => {
        expect(QueryDetailsController._closeCommentDialog).toHaveBeenCalled();
      });
    });
  });

  describe('#cloneQuery', () => {
    beforeEach(() => {
      spyOn(QueryDetailsController, '_internalizeQueryItem').and.returnValue(clonedQuery);
      QueryDetailsController.cloneQuery();
    });

    it('it calls query.clone', () => {
      expect(query.clone).toHaveBeenCalled();
    });

    it('it calls query.save', () => {
      expect(clonedQuery.save).toHaveBeenCalled();
    });

    describe('on success', () => {
      beforeEach(() => {
        digest();
      });

      it('calls _internalizeQueryItem', () => {
        expect(QueryDetailsController._internalizeQueryItem).toHaveBeenCalled();
      });

      it('navigates to the cloned query page', () => {
        expect(QueryHandler.navigateToLatestVersion).toHaveBeenCalledWith(clonedQuery);
      });
    });
  });

  describe('#deleteQuery', () => {
    beforeEach(() => {
      QueryDetailsController.deleteQuery();
      digest();
    });

    it('it calls query.destroy', () => {
      expect(query.destroy).toHaveBeenCalled();
    });

    describe('on success', () => {
      beforeEach(() => {
        digest();
      });

      it('navigates to index page', () => {
          expect(QueryHandler.navigateToIndex).toHaveBeenCalled();
      });
    });
  });

  describe('#aceLoaded', () => {
    beforeEach(() => {
      QueryDetailsController.aceLoaded('editor');
    });

    it('constructs DefaultAceConfigurator, passing in the editor object', () => {
      expect(DefaultAceConfigurator).toHaveBeenCalledWith('editor');
    });

    it('uses the readOnlyConfig', () => {
      expect(defaultAceConfigurator.readOnlyConfig).toHaveBeenCalled();
    });
  });
});
