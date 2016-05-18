!(angular => {
  'use strict';

  function ColumnModelImports(SchemaColumnResource, CollectionModelBase, UnpersistedModel) {

    return class SchemaColumns extends CollectionModelBase {

      constructor() {
        super(SchemaColumnResource, UnpersistedModel);
        this.uniqueSchemas = [];
        this.uniqueTables = [];
        this.uniqueColumns = [];
        this.schemaTables = {};
      }

      initCollection() {
        return super.initCollection().then(this._processUniqueAttributes.bind(this));
      }

      // private methods

      _processUniqueAttributes(columns) {
        let columnNames = [];
        let tables = [];
        let schemas = [];

        _.each(columns, column => {
          columnNames.push(column.item.column);
          tables.push(column.item.table);
          schemas.push(column.item.schema);
          this._addToSchemaTables(column);
        });

        this.uniqueColumns = _.uniq(columnNames);
        this.uniqueTables = _.uniq(tables);
        this.uniqueSchemas = _.uniq(schemas);
        return columns;
      }

      _addToSchemaTables(column) {
        let tables = this.schemaTables[column.item.schema];
        if(!tables) {
          tables = [];
          this.schemaTables[column.item.schema] = tables;
        }

        if(!_.contains(tables, column.item.table)) {
          tables.push(column.item.table);
        }
      }
    };
  }

  ColumnModelImports.$inject = ['SchemaColumnResource', 'CollectionModelBase', 'UnpersistedModel'];
  angular.module('alephServices.schema.columns', []).service('SchemaColumns', ColumnModelImports);

}(angular));
