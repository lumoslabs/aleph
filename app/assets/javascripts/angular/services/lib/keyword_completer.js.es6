!(angular => {
  'use strict';

  function KeywordCompleterImports(MatcherRunner, LocalResource) {

    return class KeywordCompleter {
      constructor() {
        const matchers = [
          {
            meta: 'keyword',
            contextRelevance: {
              all: 1000
            }
          }
        ];

        let _this = this;
        new LocalResource().get('keyword_config.json').then(keyword => {
          _this._matcherRunner = new MatcherRunner(matchers, keyword.data);
        });
      }

      getCompletions(editor, session, pos, prefix, callback) {
        if (prefix.length === 0) { callback(null, []); return; }

        if (_.exists(this._matcherRunner)) {
          let matches = this._matcherRunner.execute('all', {}, prefix.toUpperCase());
          callback(null, matches);
        }
      }
    };
  }

  KeywordCompleterImports.$inject = ['MatcherRunner', 'LocalResource'];
  angular.module('alephServices.keywordCompleter', []).service('KeywordCompleter', KeywordCompleterImports);
}(angular));
