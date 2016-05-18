!(angular => {
  'use strict';

  /* QueryTab does the following:
    - Activate tabs
    - Access tab info from url parameter
    - Keeps state about which tab is active
    - Programatically 'navigate' to tabs by setting activity and url parameters
  */

  class QueryTab {
    constructor($location) {
      this._initTabs();
      this.$location = $location;
      this._defaultTab = 'query';
    }

    set defaultTag(dt) {
      this._defaultTab = dt;
    }

    get defaultTag() {
      return this._defaultTab;
    }

    setActiveTabFromUrl() {
      this._activateTab(this.getTab());
    }

    navigateToTab(tab) {
      this._activateTab(tab);
      this.setTab(tab);
    }

    setTab(s) {
      this.$location.search('tab', s);
    }

    getTab() {
      let rawTab = this.$location.search().tab;
      return (rawTab === 'visualizations' || rawTab === 'results') ? rawTab : 'query';
    }

    // private methods

    _initTabs() {
      this.state = {
        query: { active: false },
        results: { active: false },
        visualizations: { active: false }
      };
    }

    _activateTab(tab) {
      this._initTabs();
      this.state[tab].active = true;
    }
  }

  QueryTab.$inject = ['$location'];
  angular.module('alephServices.queryTab', []).service('QueryTab', QueryTab);

}(angular));
