'use strict';

describe('PaginationComponents', () => {
  let PaginationComponents;
  let paginationComponents;
  let Pagination;
  let pagination;
  let SpinnerState;
  let $location;

  beforeEach(module('alephServices'));

  beforeEach(module($provide => {
    let provide = ProvisionHelper.withProvide($provide);

    [Pagination, pagination] = provide.classAndInstanceValue('Pagination', {
      reload: jasmine.createSpy('pagination.reload'),
      toggleSortOrder: jasmine.createSpy('pagination.toggleSortOrder'),
      fetch: jasmine.createSpy('pagination.fetch'),
      dirtyItems: jasmine.createSpy('pagination.dirtyItems'),
      isDirty: jasmine.createSpy('pagination.isDirty'),
      isPristine: jasmine.createSpy('pagination.isPristine'),
      revert: jasmine.createSpy('pagination.revert'),
      save: jasmine.createSpy('pagination.save')
    });
  }));

  beforeEach(inject((_PaginationComponents_, _SpinnerState_, _$location_) => {
    // spy on $location
    $location = _$location_;
    spyOn($location, 'search').and.returnValue( { search: 'urlSearchTerm' });

    // spy on spinner state / spinner
    SpinnerState = _SpinnerState_;
    spyOn(SpinnerState, 'withContext').and.returnValue({
      on: () => 'spinnerOn',
      off: () => 'spinnerOff'
    });

    PaginationComponents = _PaginationComponents_;
    paginationComponents = new PaginationComponents('paginationKey', 'resourceAction', 'Model', {
      additionalParams: { random: 'parameter' }
    });
  }));

  describe('on construction', () => {
    it('construct spinner objects', () => {
      expect(SpinnerState.withContext).toHaveBeenCalledWith('paginationKey');
    });

    it('parses out the search text from the url search parameters', () => {
      expect($location.search).toHaveBeenCalled();
      expect(paginationComponents.searchText).toEqual('urlSearchTerm');
    });

    it('constructs a pagination object w/ proper defaulting', () => {
      let args = Pagination.calls.argsFor(0);
      expect(args[0]).toEqual('paginationKey');
      expect(args[1]).toEqual('resourceAction');
      expect(args[2]).toEqual('Model');

      // expect options to be passed in / defaulted correctly
      let options = args[3];
      expect(options.initialSearch).toEqual('urlSearchTerm');
      expect(options.initialSort).toEqual('updated_at');
      expect(options.additionalParams).toEqual({ random: 'parameter' });

      //expect spinner functions are passed in correctly
      expect(options.spinnerOff()).toEqual('spinnerOff');
      expect(options.spinnerOn()).toEqual('spinnerOn');
    });
  });

  describe('#setSearch', () => {
    beforeEach(() => {
      spyOn(paginationComponents, 'triggerSearch');
    });

    describe('when quote is true', () => {
      beforeEach(() => {
        paginationComponents.setSearch('someText', true);
      });

      it('it wraps searchText value in quotes', () => {
        expect(paginationComponents.searchText).toBe('"someText"');
      });

      it('calls triggerSearch', () => {
        expect(paginationComponents.triggerSearch).toHaveBeenCalled();
      });
    });

    describe('when quote is false', () => {
      beforeEach(() => {
        paginationComponents.setSearch('someText');
      });

      it('it simply sets the searchText', () => {
        expect(paginationComponents.searchText).toBe('someText');
      });

      it('calls triggerSearch', () => {
        expect(paginationComponents.triggerSearch).toHaveBeenCalled();
      });
    });
  });

  describe('#triggerSearch', () => {
    beforeEach(() => {
      paginationComponents.searchText = 'someText';
      paginationComponents.triggerSearch();
    });

    it('sets the search term in the url', () => {
      expect($location.search).toHaveBeenCalledWith('search', 'someText');
    });

    it('sets the search term in Pagination', () => {
      expect(pagination.search).toBe('someText');
    });

    it('sets the search term in Pagination', () => {
      expect(pagination.reload).toHaveBeenCalled();
    });
  });

  describe('#clearSearch', () => {
    beforeEach(() => {
      spyOn(paginationComponents, 'triggerSearch');
      paginationComponents.searchText = 'something';
      paginationComponents.clearSearch();
    });

    it('nulls out the searchText', () => {
      expect(paginationComponents.searchText).toBe(null);
    });

    it('calls triggerSearch', () => {
      expect(paginationComponents.triggerSearch).toHaveBeenCalled();
    });
  });

  describe('#setSort', () => {
    describe('when sortBy equals the current sortby', () => {
      beforeEach(() => {
        pagination.sortBy = 'updated_at';
        paginationComponents.setSort('updated_at');
      });

      it('calls pagination.toggleSortOrder', () => {
        expect(pagination.toggleSortOrder).toHaveBeenCalled();
      });

      it('calls pagination.reload', () => {
        expect(pagination.reload).toHaveBeenCalled();
      });
    });

    describe('when sortBy does not equal the current sortby', () => {
      beforeEach(() => {
        pagination.sortBy = 'updated_at';
        paginationComponents.setSort('created_at');
      });

      it('it sets the sortBy', () => {
        expect(pagination.sortBy).toBe('created_at');
      });

      it('calls pagination.reload', () => {
        expect(pagination.reload).toHaveBeenCalled();
      });
    });
  });

  describe('#items', () => {
    beforeEach(() => {
      pagination.collection = [{ item: 'a' }, { item: 'b'}];
    });

    it('return array of items of the pagination.collection', () => {
      expect(paginationComponents.items()).toEqual([ 'a', 'b' ]);
    });
  });
});
