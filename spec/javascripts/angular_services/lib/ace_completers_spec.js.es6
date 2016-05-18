'use strict';

describe('AceCompleters', () => {
  let AceCompleters;
  let SchemaCompleter;
  let schemaCompleter;

  beforeEach(module('alephServices'));

  beforeEach(module($provide => {
    let provide = ProvisionHelper.withProvide($provide);

    [SchemaCompleter, schemaCompleter] = provide.classAndInstanceValue('SchemaCompleter', {
      loadColumnData: jasmine.createSpy('SchemaCompleter.loadColumnData'),
      isLoaded: jasmine.createSpy('SchemaCompleter.isLoaded').and.returnValue(false)
    });
  }));

  beforeEach(inject(_AceCompleters_ => {
    AceCompleters = _AceCompleters_;
    spyOn(AceCompleters.langTools, 'setCompleters');
  }));

  it('#setCompleters sets completers in ace lang tools', () => {
    AceCompleters.setCompleters();
    expect(AceCompleters.langTools.setCompleters).toHaveBeenCalled();
  });

  describe('#ensureSchemasData when schemaCompleter.isLoaded() is false', () => {
    beforeEach(() => {
      AceCompleters.ensureSchemasData();
    });

    it('calls schemaCompleter.loadColumnData', () => {
      expect(schemaCompleter.loadColumnData).toHaveBeenCalled();
    });
  });
});
