'use strict';

describe('SchemaCompleter', () => {
  let session;
  let editor;
  let pos;
  let prefix;
  let digest;
  let callback;
  let schemaCompleter;
  let SchemaCompleter;
  let SchemaColumns;
  let schemaColumns;
  let MatcherRunner;
  let matcherRunner;
  let aceSqlParse;
  let resolve;

  beforeEach(module('alephServices'));

  beforeEach(module($provide => {
    let provide = ProvisionHelper.withProvide($provide);

    [MatcherRunner, matcherRunner] = provide.classAndInstanceValue('MatcherRunner', {
      execute: jasmine.createSpy('MatcherRunner.execute').and.returnValue(['match_1', 'match_2'])
    });

    aceSqlParse = provide.value('aceSqlParse', jasmine.createSpy('aceSqlParse')
     .and.returnValue({
       currentClause: 'from',
       fromClause: 'warehouse.email_user_targetings'
     }));

    let tables = ['table_1', 'table_2', 'email_user_targetings'];
    let schemas = ['schema_1', 'schema_2', 'warehouse'];

    [SchemaColumns, schemaColumns] = provide.classAndInstanceValue('SchemaColumns', {
        initCollection: jasmine.createSpy('SchemaColumns.initCollection')
          .and.callFake(() => resolve(tables)),
        uniqueTables: tables,
        uniqueSchemas: schemas
    });
  }));

  beforeEach(inject((_SchemaCompleter_, $q, $rootScope) => {
    digest = () => { $rootScope.$digest(); };
    resolve = (v) => $q.when(v);

    // ace setup
    let el = document.createElement('div');
    let VirtualRenderer = ace.require('./virtual_renderer').VirtualRenderer;
    let Editor = ace.require('./editor').Editor;
    let renderer = new VirtualRenderer(el);
    session = ace.createEditSession('SELECT nothing', 'ace/mode/pgsql');
    editor = new Editor(renderer, session);
    pos = {
      column: 1,
      row: 1
    };

    SchemaCompleter = _SchemaCompleter_;
    callback = jasmine.createSpy('callbackSpy').and.callFake(() => {});
    spyOn(SchemaCompleter.prototype, 'loadColumnData').and.callThrough();
    schemaCompleter = new SchemaCompleter();
    digest();
  }));

  describe('on initialization', () => {
    it('creates a SchemaColumns model', () => {
      expect(SchemaColumns).toHaveBeenCalled();
    });

    it('loads column data', () => {
      expect(schemaCompleter.loadColumnData).toHaveBeenCalled();
    });
  });

  describe('on loadColumnData()', () => {
    beforeEach(() => {
      schemaCompleter.loadColumnData();
    });

    it('inits the column collection', () => {
      expect(schemaColumns.initCollection).toHaveBeenCalled();
    });

    it('creates a new MatcherRunner', () => {
      expect(MatcherRunner).toHaveBeenCalled();
    });

    describe('and isLoaded()', () => {
      it('returns truthy', () => {
        expect(schemaCompleter.isLoaded()).toBeTruthy();
      });
    });
  });

  describe('.getCompletions', () => {
    describe('when the prefix is empty string', () => {
      beforeEach(() => {
        prefix = '';
        schemaCompleter.getCompletions(editor, session, pos, prefix, callback);
      });

      it('asks the MatcherRunner to execute', () => {
        expect(matcherRunner.execute).toHaveBeenCalledWith('from', {
          tableRestrict: [],
          schemaRestrict: ['warehouse']
        }, '');
      });

      it('calls the callback with the matches', () => {
        expect(callback).toHaveBeenCalledWith(null, ['match_1', 'match_2']);
      });
    });

    describe('when the prefix is not empty', () => {
      beforeEach(() => {
        prefix = 'a';
        schemaCompleter.getCompletions(editor, session, pos, prefix, callback);
      });

      it('asks the AceSqlParser to parse the SQL', () => {
        expect(aceSqlParse).toHaveBeenCalled();
      });

      it('asks the MatcherRunner to execute', () => {
        expect(matcherRunner.execute).toHaveBeenCalledWith('from', {
          tableRestrict: ['email_user_targetings'],
          schemaRestrict: ['warehouse']
        }, 'a');
      });

      it('calls the callback with the matches', () => {
        expect(callback).toHaveBeenCalledWith(null, ['match_1', 'match_2']);
      });
    });
  });
});
