!(angular => {
  'use strict';

  class AceCompleters {
    constructor(SchemaCompleter, KeywordCompleter) {
      this.langTools = ace.require('ace/ext/language_tools');
      this.schemaCompleter = new SchemaCompleter();
      this.keywordCompleter = new KeywordCompleter();
    }

    ensureSchemasData() {
      if (!this.schemaCompleter.isLoaded()) {
        return this.schemaCompleter.loadColumnData();
      }
    }

    setCompleters() {
      this.langTools.setCompleters([
        this.schemaCompleter,
        this.keywordCompleter,
        this.langTools.textCompleter,
        this.langTools.snippetCompleter
      ]);
    }
  }

  AceCompleters.$inject = ['SchemaCompleter', 'KeywordCompleter'];
  angular.module('alephServices.aceCompleters', []).service('AceCompleters', AceCompleters);
}(angular));
