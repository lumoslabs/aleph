!(angular => {
  'use strict';

  class SchemaIndexController {
    constructor(SchemaColumnResource, SchemaColumn, SchemaColumns, PaginationComponents, SpinnerState) {
      this.pagination = new PaginationComponents(
        'Paginated Schema',
        SchemaColumnResource.index,
        SchemaColumn,
        {
          additionalParams: { with_comments: true },
          limit: 150
        }
      );

      this.columns = new SchemaColumns();
      let spinner = SpinnerState.withContext('SchemaColumns');
      spinner.on();
      this.columns.initCollection().then(spinner.off.bind(spinner));
    }

    directory() {
      return _.chain(this.columns.schemaTables).pairs()
        .reduce((acc, entry) => {
          return acc.concat(_.map(entry[1], table => {
            return {
              schema: entry[0],
              table: table
            };
          }));
        }, [])
        .value();
    }

    typeAheadValues(search) {
      let schemasRe = /^[A-z]+$/;
      let tablesRe = /^[A-z]+\.[A-z]*$/;

      if(schemasRe.test(search)) {
        return _.filter(this.columns.uniqueSchemas, str => str.indexOf(search) > -1);
      } else if(tablesRe.test(search)) {
        let schema = search.split('.')[0];
        let tables = this.columns.schemaTables[schema];
        return _.chain(tables)
          .map(table => schema + '.' + table)
          .filter(str => str.indexOf(search) > -1)
          .value();
      } else {
        return [];
      }
    }
  }

  SchemaIndexController.$inject = ['SchemaColumnResource', 'SchemaColumn', 'SchemaColumns', 'PaginationComponents',
    'SpinnerState'];

  angular
    .module('alephControllers.schemaIndexController', ['alephServices'])
    .controller('SchemaIndexController', SchemaIndexController);

}(angular));
