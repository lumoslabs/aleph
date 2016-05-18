!(function (angular) {
  'use strict';

  class AceSnippetManager {
    constructor() {
      this._context = 'pgsql';
      this._aceSnippetManager = ace.require('ace/snippets').snippetManager;
    }

    set context(c) {
      this._context = c;
    }

    get context() {
      return this._context;
    }

    add(name, content) {
      this._aceSnippetManager.register(this._parseSnippet(name, content), this._context);
    }

    remove(name, content) {
      this._aceSnippetManager.unregister(this._parseSnippet(name, content), this._context);
    }

    reset() {
      this._aceSnippetManager.snippetMap = {};
      this._aceSnippetManager.snippetNameMap = {};
    }

    // private method

    _parseSnippet(name, content) {
      let composed = 'snippet ' + name + ' \n\t ' + this._transformNewlines(content);
      return this._aceSnippetManager.parseSnippetFile(composed);
    }

    _transformNewlines(content) {
      return content.replace(/(\r\n|\n|\r)/gm, '\n\t');
    }
  }

  angular.module('alephServices.aceSnippetManager', []).service('AceSnippetManager', AceSnippetManager);
}(angular));
