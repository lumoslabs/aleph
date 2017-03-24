!(angular => {
  'use strict';

  function SchemaCompleterImports(aceSqlParse, SchemaColumns, MatcherRunner, SCHEMA_MATCHERS) {

    return class SchemaCompleter {

      constructor() {
        this.identifierRegexps = [/[a-zA-Z_0-9\$\-\u00A2-\uFFFF]/, /\./]
        this._columns = new SchemaColumns();
        this.loadColumnData();
      }

      loadColumnData() {
        this._columns.initCollection().then(columns => {
          this._rawColumnsData = columns;
          this._matcherRunner = new MatcherRunner(SCHEMA_MATCHERS, _.map(columns, o => o.item));
        });
      }

      isLoaded() {
        return _.exists(this._rawColumnsData) && this._rawColumnsData.length > 0;
      }

      getCompletions(editor, session, pos, prefix, callback) {
        let parsedSql = aceSqlParse(session, pos);
        let currentClause = parsedSql.currentClause;
        let isSubstring = this._makeIsSubstringFn(parsedSql.fromClause);
        let matchingTables = []
        if (prefix != '') {
          matchingTables = _(this._columns.uniqueTables).filter(isSubstring);
        }
        let matchingSchemas = _(this._columns.uniqueSchemas).filter(isSubstring);

        if (_.exists(this._matcherRunner)) {
          let matches = this._matcherRunner.execute(currentClause, {
            tableRestrict: matchingTables,
            schemaRestrict: matchingSchemas
          }, prefix);
          callback(null, matches);
        }
      }

      // private methods

      _makeIsSubstringFn(check) {
        return string => _.exists(check) ? check.indexOf(string) > -1 : false;
      }
    };
  }


  SchemaCompleterImports.$inject = ['aceSqlParse', 'SchemaColumns', 'MatcherRunner', 'SCHEMA_MATCHERS'];
  angular.module('alephServices.schemaCompleter', ['aleph.schemaCompleterConfig'])
    .service('SchemaCompleter', SchemaCompleterImports);

}(angular));
