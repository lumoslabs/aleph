'use strict';

describe('SchemaIndexController', () => {
  let SchemaIndexController;
  let PaginationComponents;
  let paginationComponents;
  let SchemaColumns;
  let schemaColumns;
  let SpinnerState;
  let spinner;
  let digest;

  beforeEach(module('alephControllers'));

  beforeEach(inject(($controller, _SpinnerState_, $rootScope, $q) => {
    digest = () => { $rootScope.$digest(); };

    spinner = {
      on: jasmine.createSpy('spinner.on'),
      off: jasmine.createSpy('spinner.off')
    };

    SpinnerState = _SpinnerState_;
    spyOn(SpinnerState, 'withContext').and.returnValue(spinner);

    [PaginationComponents, paginationComponents] = TestUtils.classAndInstance('PaginationComponents', {});
    [SchemaColumns, schemaColumns] = TestUtils.classAndInstance('SchemaColumns', {
      initCollection: jasmine.createSpy('SchemaColumns.initCollection').and
        .returnValue($q.when('schemasColumnsInitSuccess'))
    });

    SchemaIndexController = $controller('SchemaIndexController', {
      PaginationComponents: PaginationComponents,
      SchemaColumns: SchemaColumns
    });
  }));

  describe('on construction', () => {

    it('constructs a PaginationComponents', () => {
      expect(PaginationComponents).toHaveBeenCalled();
    });

    it('constructs a SchemaColumns', () => {
      expect(SchemaColumns).toHaveBeenCalled();
    });

    it('calls SchemaColumns.initCollection', () => {
      expect(schemaColumns.initCollection).toHaveBeenCalled();
    });

    it('makes a spinner for SchemaColumns', () => {
      expect(SpinnerState.withContext).toHaveBeenCalledWith('SchemaColumns');
    });

    it('call spinner on for SchemaColumns spinner', () => {
      expect(spinner.on).toHaveBeenCalled();
    });

    describe('on response', () => {
      beforeEach(() => {
        digest();
      });

      it('call spinner off for SchemaColumns spinner', () => {
        expect(spinner.off).toHaveBeenCalled();
      });
    });
  });

  describe('#typeAheadValues', () => {
    beforeEach(() => {
      schemaColumns.uniqueSchemas = ['alpha', 'alphabet', 'fire'];
      schemaColumns.schemaTables = {
        alpha: ['xylaphone', 'xylaphone_player'],
        alphabet: ['meh'],
        fire: ['earth']
      };
    });

    describe('when value could be a schema', () => {
      let tavs;
      beforeEach(() => {
        tavs = SchemaIndexController.typeAheadValues('alph');
      });

      it('return any schemas  where search value is a substring of the schema', () => {
        expect(tavs).toEqual(['alpha', 'alphabet']);
      });
    });

    describe('when value could be schema.table', () => {
      let tavs;
      beforeEach(() => {
        tavs = SchemaIndexController.typeAheadValues('alpha.xy');
      });

      it('return any schemas.table where search value is a substring of the schema.table', () => {
        expect(tavs).toEqual(['alpha.xylaphone', 'alpha.xylaphone_player']);
      });
    });
  });
});
