!(angular => {
  'use strict';

  function DefaultAceConfiguratorImports(ModelManager, AceSnippetManager) {

    return class DefaultAceConfigurator {

      constructor(editor) {
        this._editor = editor;
        this._defaultConfig();

        this._Snippet = ModelManager.forModelName('snippet').modelClass();
        this._Snippets = ModelManager.forModelName('snippet').collectionClass(this._Snippet);
        this._snippets = new this._Snippets();
      }

      readOnlyConfig() {
        this._editor.setReadOnly(true);
        this._editor.renderer.$cursorLayer.element.style.opacity=0;
        this._editor.setOptions({
          highlightActiveLine: false,
          highlightGutterLine: false,
          maxLines: 25,
          minLines: 2
        });
        return this;
      }

      autoCompleteConfig() {
        this._editor.setOptions({
          enableSnippets: true,
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true
        });
        return this;
      }

      snippetsConfig() {
        AceSnippetManager.reset();
        this._snippets.initCollection().then(snippets => {
          _.each(snippets, snippet => {
            AceSnippetManager.add(snippet.item.name, snippet.item.content);
          });
        });

        this.autoCompleteConfig();

        return this;
      }

      // private method

      _defaultConfig() {
        let session = this._editor.getSession();
        session.setTabSize(2);
        session.setUseSoftTabs(true);
        this._editor.setPrintMarginColumn(100);
        this._editor.setShowPrintMargin(true);
        this._editor.setBehavioursEnabled(true);
        this._editor.$blockScrolling = Infinity;
        this._editor.setOptions({
          maxLines: 25,
          minLines: 2
        });
      }
    };
  }

  DefaultAceConfiguratorImports.$inject = ['ModelManager', 'AceSnippetManager'];
  angular
    .module('alephServices.defaultAceConfigurator', [])
    .service('DefaultAceConfigurator', DefaultAceConfiguratorImports);

}(angular));
