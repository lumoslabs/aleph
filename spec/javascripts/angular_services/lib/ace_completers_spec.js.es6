'use strict';

describe('AceCompleters', () => {
  let AceCompleters;

  beforeEach(module('alephServices'));

  beforeEach(inject(_AceCompleters_ => {
    AceCompleters = _AceCompleters_;
    spyOn(AceCompleters.langTools, 'setCompleters');
  }));

  it('#setCompleters sets completers in ace lang tools', () => {
    AceCompleters.setCompleters();
    expect(AceCompleters.langTools.setCompleters).toHaveBeenCalled();
  });
});
