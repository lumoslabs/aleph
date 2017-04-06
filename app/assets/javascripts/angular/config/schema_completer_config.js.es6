!(angular => {
  'use strict';

  let filters = {
    tableRestrictionMet(item, filterArgs) {
      return ((filterArgs.tableRestrict.length === 0) ||  _.contains(filterArgs.tableRestrict, item.table));
    },
    schemaRestrictionMet(item, filterArgs) {
      return ((filterArgs.schemaRestrict.length === 0) || _.contains(filterArgs.schemaRestrict, item.schema));
    }
  };

  angular
    .module('aleph.schemaCompleterConfig', [])

    .constant('SCHEMA_MATCHERS', [
        {
          nameProperty: 'schema',
          meta: 'schema',
          contextRelevance: {
            from: 1000
          }
        },
        {
          nameProperty: 'column',
          meta: 'column',
          contextRelevance: {
            select: 1000,
            from: 500,
            where: 1000
          },
          contextItemFilters: {
            select: [
              filters.schemaRestrictionMet,
              filters.tableRestrictionMet
            ],
            from: [
              filters.schemaRestrictionMet,
              filters.tableRestrictionMet
            ],
            where: [
              filters.schemaRestrictionMet,
              filters.tableRestrictionMet
            ]
          }
        },
        {
          nameProperty: 'table',
          meta: 'table',
          contextRelevance: {
            select: 500,
            from: 1000,
            where: 500,
            postDot: 2000
          },
          contextItemFilters: {
            select: [
              filters.schemaRestrictionMet,
              filters.tableRestrictionMet
            ],
            from: [
              filters.schemaRestrictionMet
            ],
            postDot: [
              filters.schemaRestrictionMet
            ],
            where: [
              filters.schemaRestrictionMet,
              filters.tableRestrictionMet
            ]
          }
        }
      ]);

}(angular));
