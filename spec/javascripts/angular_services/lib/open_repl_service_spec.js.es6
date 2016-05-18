'use strict';

describe('Open Repl Service', () => {
  let modal;
  let q;
  let OpenReplService;
  let Query;
  let query;
  let modalOpenParams;
  let modalResult;
  let AceCompleters;

  function expectQueryCopy(copiedQueryObject, toCopyItem) {
    expect(Query).toHaveBeenCalled();
    expect(query.internalize).toHaveBeenCalledWith(toCopyItem);
    expect(copiedQueryObject.item).toEqual(toCopyItem);
    expect(copiedQueryObject.item).not.toBe(toCopyItem);
  }

  beforeEach(module('aleph'));

  beforeEach(module($provide => {
    query = {
      internalize: jasmine.createSpy('mockQuery.internalize').and.callFake(i => {
        query.item = i;
      }),
      initItem: jasmine.createSpy('mockQuery.initItem')
    };

    Query = jasmine.createSpy('MockQuery').and.returnValue(query);
    $provide.value('Query', Query);
  }));

  beforeEach(inject((_OpenReplService_, _AceCompleters_, $uibModal, $q) => {
    OpenReplService = _OpenReplService_;
    modal = $uibModal;
    q = $q;
    AceCompleters = _AceCompleters_;

    spyOn(AceCompleters, 'ensureSchemasData');

    modalResult = {
      then: (success, failure) => {
       modalResult.success = success;
       modalResult.failure = failure;
       return 'modalPromise';
     }
   };

    spyOn(modal, 'open').and.callFake(params => {
      modalOpenParams = params;
      return { result: modalResult };
    });
  }));

  describe('#open', () => {
    describe('when no query object is passed in', () => {
      beforeEach(() => {
        OpenReplService.open();
      });

      it('calls modal.open', () => {
        expect(modal.open).toHaveBeenCalled();
      });

      it('ensures schema data for completers', () => {
        expect(AceCompleters.ensureSchemasData).toHaveBeenCalled();
      });

      describe('on resolve', () => {
        beforeEach(() => {
          modalOpenParams.resolve.query();
        });

        it('creates a new query for the resolve.query function', () => {
          expect(Query).toHaveBeenCalled();
          expect(query.initItem).toHaveBeenCalled();
        });
      });
    });

    describe('when a query object is passed in', () => {
      beforeEach(() => {
        OpenReplService.open({query: { item: { a: 'bleh' } }});
      });

      it('calls modal.open', () => {
        expect(modal.open).toHaveBeenCalled();
      });

      describe('on resolve', () => {
        let resolvedQuery;
        beforeEach(() => {
          resolvedQuery = modalOpenParams.resolve.query();
        });

        it('copies the passed in query for the resolve.query function', () => {
          expectQueryCopy(resolvedQuery, { a: 'bleh'});
        });
      });
    });

    describe('on success from the modal instance', () => {
      let resultObject;
      let successReturn;

      beforeEach(() => {
        resultObject = {
          query: { item: { a: 'blerg' } },
          result: 'queryResult'
        };

        OpenReplService.open();
        successReturn = modalResult.success(resultObject);
      });

      it('copies the result query', () => {
        expectQueryCopy(successReturn.query, { a: 'blerg'});
      });

      it('success returns result as is', () => {
        expect(successReturn.result).toBe('queryResult');
      });
    });
  });
});
