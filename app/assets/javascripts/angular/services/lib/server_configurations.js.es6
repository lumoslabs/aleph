!(angular => {
  'use strict';

  class ServerConfigurations {
    constructor() {
      this.configurations = {};
    }

    setConfigs(c) {
      this.configurations = JSON.parse(c);
    }
  }

  angular.module('alephServices.serverConfigurations', []).service('ServerConfigurations', ServerConfigurations);
}(angular));
