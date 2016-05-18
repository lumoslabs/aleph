'use strict';

describe('aceSqlParse', () => {
  let renderer;
  let session;
  let aceSqlParse;
  let Editor;
  let editor;

  beforeEach(module('alephServices'));

  function createEditorWithString(string) {
    session = ace.createEditSession(string, 'ace/mode/pgsql');
    editor = new Editor(renderer, session);
  }

  function parse() {
    let cursorPos = editor.getCursorPosition();
    return aceSqlParse(session, cursorPos);
  }

  beforeEach(inject(_aceSqlParse_ => {
    /* FIXME:
     I think the this code causes the below warning (you'll see when running tests):
       WARN: 'Automatically scrolling cursor into view after selection change',
       'this will be disabled in the next version',
       'set editor.$blockScrolling = Infinity to disable this message'
    */
    let el = document.createElement('div');
    let VirtualRenderer = ace.require('./virtual_renderer').VirtualRenderer;
    Editor = ace.require('./editor').Editor;
    renderer = new VirtualRenderer(el);
    aceSqlParse = _aceSqlParse_;
  }));

  describe('currentClause', () => {
    describe('for a simple query', () => {
      beforeEach(() => {
        createEditorWithString('SELECT eyeballs FROM my_face WHERE color = "blue"');
      });

      describe('when the cursor is in the SELECT clause', () => {
        beforeEach(() => { editor.moveCursorTo(0, 10); });

        it('sets the currentClause to select', () => {
          expect(parse().currentClause).toBe('select');
        });
      });

      describe('when the cursor is in the FROM clause', () => {
        beforeEach(() => { editor.moveCursorTo(0, 24); });

        it('sets the currentClause to from', () => {
          expect(parse().currentClause).toBe('from');
        });
      });

      describe('when the cursor is in the WHERE clause', () => {
        beforeEach(() => { editor.moveCursorTo(0, 40); });

        it('sets the currentClause to where', () => {
          expect(parse().currentClause).toBe('where');
        });
      });
    });

    describe('for a query with subselects', () => {
      beforeEach(() => {
        createEditorWithString(
          'SELECT eyeballs FROM (SELECT DISTINCT id FROM' +
          'warehouse.email_user_targetings) WHERE color = "blue"'
        );
      });

      it('it assumes the most recent previous keyword is its clause name', () => {
        editor.moveCursorTo(0, 34);
        expect(parse().currentClause).toBe('select');
      });
    });
  });

  describe('fromClause', () => {
    describe('when the sql contains a FROM clause and a WHERE clause', () => {
      beforeEach(() => {
        createEditorWithString('SELECT eyeballs FROM my_face WHERE color = "blue"');
      });

      describe('when the cursor is in the SELECT clause', () => {
        beforeEach(() => { editor.moveCursorTo(0, 10); });

        it('sets the fromClause to what is between subsequent FROM and WHERE', () => {
          expect(parse().fromClause).toBe(' my_face ');
        });
      });

      describe('when the cursor is in the FROM clause', () => {
        beforeEach(() => { editor.moveCursorTo(0, 24); });

        it('sets the fromClause to what is within the current FROM clause', () => {
          expect(parse().fromClause).toBe(' my_face ');
        });
      });

      describe('when the cursor is in the WHERE clause', () => {
        beforeEach(() => { editor.moveCursorTo(0, 40); });

        it('sets the fromClause to what is within the previous FROM clause', () => {
          expect(parse().fromClause).toBe(' my_face ');
        });
      });
    });

    describe('when the sql does not contain a WHERE clause', () => {
      beforeEach(() => {
        createEditorWithString('SELECT eyeballs FROM my_face');
        editor.moveCursorTo(0, 10);
      });

      it('considers everything after FROM to be the from clause', () => {
        expect(parse().fromClause).toBe(' my_face');
      });
    });

    describe('if it cannot find a FROM or WHERE keyword', () => {
      beforeEach(() => {
        createEditorWithString('SELECT eyeballs my_face');
        editor.moveCursorTo(0, 10);
      });

      it('considers everything to be the FROM clause', () => {
        expect(parse().fromClause).toBe('SELECT eyeballs my_face');
      });
    });
  });
});
