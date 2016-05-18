'use strict';

describe('AceSnippetManager', () => {
  let AceSnippetManager;

  beforeEach(module('alephServices'));

  beforeEach(inject(_AceSnippetManager_ => {
    AceSnippetManager = _AceSnippetManager_;
    spyOn(AceSnippetManager._aceSnippetManager, 'register');
    spyOn(AceSnippetManager._aceSnippetManager, 'unregister');
    spyOn(AceSnippetManager._aceSnippetManager, 'parseSnippetFile').and.callFake(input => input);
  }));

  describe('#add', () => {
    beforeEach(() => {
      AceSnippetManager.add('mySnippet', 'mySnippetContent');
    });

    it('delegates to ace SnippetManger#register', () => {
      expect(AceSnippetManager._aceSnippetManager.register)
        .toHaveBeenCalledWith('snippet mySnippet \n\t mySnippetContent', 'pgsql');
    });
  });

  describe('#remove', () => {
    beforeEach(() => {
      AceSnippetManager.remove('mySnippet', 'mySnippetContent');
    });

    it('delegates to ace SnippetManger#unregister', () => {
      expect(AceSnippetManager._aceSnippetManager.unregister)
        .toHaveBeenCalledWith('snippet mySnippet \n\t mySnippetContent', 'pgsql');
    });
  });

  describe('#reset', () => {
    beforeEach(() => {
      AceSnippetManager._aceSnippetManager.snippetMap = { 'a': 1 };
      AceSnippetManager._aceSnippetManager.snippetNameMap = { 'b': 1 };
      AceSnippetManager.reset();
    });

    it('empties the snippet maps', () => {
      expect(_.isEmpty(AceSnippetManager._aceSnippetManager.snippetMap)).toBeTruthy();
      expect(_.isEmpty(AceSnippetManager._aceSnippetManager.snippetNameMap)).toBeTruthy();
    });
  });
});
