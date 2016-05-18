'use strict';

describe('KeywordCompleter', () => {
  let session;
  let editor;
  let pos;
  let prefix;
  let callback;
  let keywordCompleter;
  let digest;
  let LocalResource;
  let localResource;
  let MatcherRunner;
  let matcherRunner;
  let resolveHttp;

  beforeEach(module('alephServices'));

  beforeEach(module($provide => {
    let provide = ProvisionHelper.withProvide($provide);

    [LocalResource, localResource] = provide.classAndInstanceValue('LocalResource', {
      get: jasmine.createSpy('LocalResource.get').and.callFake(() => resolveHttp(['Keyword1', 'Keyword2']))
    });

    [MatcherRunner, matcherRunner] = provide.classAndInstanceValue('MatcherRunner', {
      execute: jasmine.createSpy('MatcherRunner.execute').and.returnValue(['match_1', 'match_2'])
    });
  }));

  beforeEach(inject((KeywordCompleter, $rootScope, $q) => {
    digest = () => { $rootScope.$digest(); };
    resolveHttp = _.partial(TestUtils.resolveHttp, $q.when);

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

    // spies
    callback = jasmine.createSpy('callbackSpy');

    // create a new instance
    keywordCompleter = new KeywordCompleter();
    digest();
  }));

  describe('on initialization', () => {
    it('inits a local resource', () => {
      expect(LocalResource).toHaveBeenCalled();
    });

    it('calls localResource.get with the config file', () => {
      expect(localResource.get).toHaveBeenCalledWith('keyword_config.json');
    });

    it('creates a new MatcherRunner', () => {
      expect(MatcherRunner).toHaveBeenCalled();
    });
  });

  describe('.getCompletions', () => {
    describe('when the prefix is a lower case string', () => {
      beforeEach(() => {
        prefix = 'g';
        keywordCompleter.getCompletions(editor, session, pos, prefix, callback);
      });

      it('calls the callback with the matches', () => {
        expect(callback).toHaveBeenCalledWith(null, [ 'match_1', 'match_2' ]);
      });

      it('calls the matcher runner with the prefix converted to uppercase', () => {
        expect(matcherRunner.execute).toHaveBeenCalledWith('all', {}, 'G');
      });
    });
  });
});
