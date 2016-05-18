!(angular => {
  'use strict';

  class SnippetIndexController {

    constructor($scope, ModelManager, DefaultAceConfigurator, NavigationGuard) {
      this._snippetModelClasses = ModelManager.forModelName('snippet');

      this._Snippet = ModelManager.forModelName('snippet').modelClass();
      this._Snippets = ModelManager.forModelName('snippet').collectionClass(this._Snippet);
      this.snippets = new this._Snippets();
      this._loadSnippets();

      this.aceLoaded = function aceLoaded(editor) {
        new DefaultAceConfigurator(editor).autoCompleteConfig();
        editor.setOptions({
          maxLines: 10,
          minLines: 10
        });
      };

      // FIXME: if we move to angular 2.0 will need to figure out how to do this w/o scope
      this._navigationGuard = new NavigationGuard($scope)
        .registerOnBeforeUnload(() => {
          if(this.revertableSnippetsExist()) {
            return 'There are unsaved changes';
          }
        })
        .registerLocationChangeStart((event) => {
          if(this.revertableSnippetsExist()
              && !confirm('There are unsaved changes. Leave the page?')) {
            event.preventDefault();
          }
        });
    }

    addNewSnippet() {
      let s = new this._Snippet();
      s.initItem();
      this.snippets.collection.unshift(s);
    }

    isValidForSave(snippet) {
      return snippet.isValidForSave() && snippet.item.name !== '' && snippet.item.content !== '';
    }

    savableSnippetsExist() {
      return _.some(this.snippets.collection, (snippet) => this.isValidForSave(snippet));
    }

    revertableSnippetsExist() {
      return _.some(this.snippets.collection, (snippet) => snippet.isDirty() || !snippet.isPersisted());
    }

    updatedAt(snippet) {
      return (_.exists(snippet.item.updated_at)) ? Date.parse(snippet.item.updated_at) : Number.MAX_SAFE_INTEGER;
    }

    shouldGrayout(snippet) {
      return !_.every(this.snippets.collection, (snippet) => snippet.isPersisted()) && snippet.isPersisted();
    }

    deleteSnippet(snippet) {
      snippet.destroy().then(this._loadSnippets.bind(this));
    }

    // private methods

    _loadSnippets() {
      this.snippets.initCollection();
    }
  }

  SnippetIndexController.$inject = ['$scope', 'ModelManager', 'DefaultAceConfigurator', 'NavigationGuard'];

  angular
    .module('alephControllers.snippetIndexController', ['alephServices'])
    .controller('SnippetIndexController', SnippetIndexController);

}(angular));
