'use strict';

describe('SchemaColumns', () => {
  let SchemaColumns;
  let columns;
  let Model;
  let AlertFlash;
  let collectionModelBaseSpies;
  let SchemaColumnResource;
  let digest;

  beforeEach(module('alephServices'));

  beforeEach(module($provide => {
    let provide = ProvisionHelper.withProvide($provide);
    Model = provide.value('UnpersistedModel', 'UnpersistedModel');
    AlertFlash = provide.value('AlertFlash', SharedMocks.AlertFlash);
    collectionModelBaseSpies = provide.classSpyValue('CollectionModelBase', SharedClassMocks.CollectionModel);
  }));

  beforeEach(inject((_SchemaColumns_, _SchemaColumnResource_, $q, $rootScope) => {
    digest = () => { $rootScope.$digest(); };

    SchemaColumns = _SchemaColumns_;
    columns = new SchemaColumns();
    SchemaColumnResource = _SchemaColumnResource_;

    let columModels = _.map([
      { column: 'id', table: 'myTable', schema: 'mySchema' },
      { column: 'name', table: 'myTable', schema: 'mySchema' },
      { column: 'id', table: 'myOtherTable', schema: 'mySchema' },
      { column: 'id', table: 'yourTable', schema: 'yourSchema' }
    ], o => {
      return { item: o};
    });

    collectionModelBaseSpies.initCollection = jasmine.createSpy('collectionModelBaseSpies.initCollection')
      .and.returnValue($q.when(columModels));
  }));

  describe('on construction', () => {
    it('passes resource and Model to super class constructor', () => {
      expect(columns.collectionModelConstructorArgs[0]).toBe(SchemaColumnResource);
      expect(columns.collectionModelConstructorArgs[1]).toBe(Model);
    });
  });

  describe('#initCollection', () => {
    beforeEach(() => {
      columns.initCollection();
    });

    it('delegates to collectionModelBaseSpies.initCollection', () => {
      expect(collectionModelBaseSpies.initCollection).toHaveBeenCalled();
    });

    describe('on success', () => {
      beforeEach(() => {
        digest();
      });

      it('ingests column data correctly', () => {
        expect(columns.uniqueColumns).toEqual([ 'id', 'name' ]);
        expect(columns.uniqueTables).toEqual([ 'myTable', 'myOtherTable', 'yourTable' ]);
        expect(columns.uniqueSchemas).toEqual([ 'mySchema', 'yourSchema' ]);
        expect(columns.schemaTables).toEqual({
          mySchema: ['myTable', 'myOtherTable'],
          yourSchema: ['yourTable']
        });
      });
    });
  });
});
