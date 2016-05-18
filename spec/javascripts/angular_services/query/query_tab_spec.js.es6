'use strict';

describe('QueryTab', () => {
  let QueryTab;
  let location;

  beforeEach(module('alephServices'));

  beforeEach(inject((_QueryTab_, $location) => {
    QueryTab = _QueryTab_;
    location = $location;
  }));

  it('the defaultTag by default is query', () => {
    expect(QueryTab.defaultTag).toBe('query');
  });

  describe('#getTab', () => {
    describe('when tab parameter is query, visualization, or results', () => {
      beforeEach(() => {
        spyOn(location, 'search').and.returnValue({ tab: 'results' });
      });

      it('returns the value from the tab parameter', () => {
        expect(QueryTab.getTab()).toBe('results');
      });
    });

    describe('when tab parameter is invalid (non-existant or not query, visualization, or results)', () => {
      beforeEach(() => {
        spyOn(location, 'search').and.returnValue({ tab: undefined });
      });

      it('returns query tab', () => {
        expect(QueryTab.getTab()).toBe('query');
      });
    });
  });

  describe('#setTab', () => {
    beforeEach(() => {
      spyOn(location, 'search');
      QueryTab.setTab('meh');
    });

    it('sets search on $location for tab', () => {
      expect(location.search).toHaveBeenCalledWith('tab', 'meh');
    });
  });

  describe('#setActiveTabFromUrl', () => {
    beforeEach(() => {
      spyOn(QueryTab, '_initTabs').and.callThrough();
      spyOn(QueryTab, 'getTab').and.returnValue('results');
      QueryTab.setActiveTabFromUrl();
    });

    it('sets search on $location for tab', () => {
      expect(QueryTab._initTabs).toHaveBeenCalled();
      expect(QueryTab.state.results.active).toBeTruthy();
      expect(QueryTab.state.query.active).toBeFalsy();
      expect(QueryTab.state.visualizations.active).toBeFalsy();
    });
  });

  describe('#navigateToTab', () => {
    beforeEach(() => {
      spyOn(QueryTab, 'setTab');
      QueryTab.navigateToTab('results');
    });

    it('sets search on $location for tab', () => {
      expect(QueryTab.state.results.active).toBeTruthy();
      expect(QueryTab.state.query.active).toBeFalsy();
      expect(QueryTab.state.visualizations.active).toBeFalsy();
      expect(QueryTab.setTab).toHaveBeenCalledWith('results');
    });
  });
});
