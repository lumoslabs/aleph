'use strict';

describe('Open Repl Service', () => {
  let modal;
  let OpenReplService;
  let AceCompleters;

  beforeEach(module('aleph'));

  beforeEach(inject((_OpenReplService_, _AceCompleters_, $uibModal) => {
    OpenReplService = _OpenReplService_;
    modal = $uibModal;
    AceCompleters = _AceCompleters_;

    spyOn(AceCompleters, 'ensureSchemasData');
    spyOn(modal, 'open').and.returnValue({ result: 'myResult' });
  }));

  describe('#open', () => {
    let result;
    beforeEach(() => {
      result = OpenReplService.open();
    });

    it('calls modal.open', () => {
      expect(modal.open).toHaveBeenCalled();
    });

    it('ensures schema data for completers', () => {
      expect(AceCompleters.ensureSchemasData).toHaveBeenCalled();
    });

    it('returns the result', () => {
      expect(result).toEqual('myResult');
    });
  });
});
