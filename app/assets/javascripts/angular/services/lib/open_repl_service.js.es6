!(angular => {
  'use strict';

  class OpenReplService {

    constructor($uibModal, AceCompleters) {
      this._$modal = $uibModal;
      this._AceCompleters = AceCompleters;
    }

    open(options = {}) {
      this._AceCompleters.ensureSchemasData();

      let modalInstance = this._$modal.open({
        animation: true,
        templateUrl: 'queryRepl',
        controller: 'QueryReplController',
        controllerAs: 'queryRepl',
        bindToController: true,
        windowClass: 'query-repl-dialog',
        backdrop: 'static',
        keyboard: false,
        resolve: { options: () =>  options }
      });

      return modalInstance.result;
    }
  }

  OpenReplService.$inject = ['$uibModal', 'AceCompleters'];
  angular.module('alephServices.openReplService', []).service('OpenReplService', OpenReplService);

}(angular));
