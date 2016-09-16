'use strict';

describe('QueryHandler', () => {
  let QueryHandler;
  let $location;
  let AlertFlash;

  beforeEach(module('alephServices'));

  function toItem(i) { return { item: i } }

  beforeEach(inject((_QueryHandler_, _$location_, _AlertFlash_) => {
    QueryHandler = _QueryHandler_;
    $location = _$location_;
    AlertFlash = _AlertFlash_;

    spyOn($location, 'path');
    spyOn(AlertFlash, 'emitSuccess');
    spyOn(AlertFlash, 'emitInfo');
  }));

  describe('#navigateToLatestVersion', () => {
    beforeEach(() => {
      QueryHandler.navigateToLatestVersion(toItem({
        id: 1,
        version: {
          id: 100
        }
      }));
    });

    it('navigates to query show for query id 1', () => {
      expect($location.path).toHaveBeenCalledWith('/queries/1/query_versions/100');
    });
  });

  describe('#navigateToIndex', () => {
    beforeEach(() => {
      QueryHandler.navigateToIndex();
    });

    it('navigates to query index url', () => {
      expect($location.path).toHaveBeenCalledWith('/queries');
    });
  });

  describe('#success', () => {
    beforeEach(() => {
      QueryHandler.success('create', true, toItem({ title: 'whatevz'}));
    });

    it('flashes a success message', () => {
      expect(AlertFlash.emitSuccess).toHaveBeenCalledWith('Query "whatevz" created!', true);
    });
  });

  describe('#handleReplExit', () => {
    beforeEach(() => {
      QueryHandler.handleReplExit('QueryReplExit');
    });

    it('flashes an info message about the query repl exit', () => {
      expect(AlertFlash.emitInfo).toHaveBeenCalledWith('Exited editing REPL without saving', false);
    });
  });
});
