!(angular => {
  'use strict';

  class OpenReplService {

    constructor($uibModal, Query, AceCompleters) {
      this._$modal = $uibModal;
      this._Query = Query;
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
        resolve: {
          query: () =>  _.exists(options.query) ? this._clone(options.query) : this._newQuery()
        }
      });

      return modalInstance.result.then(({query, result}) => {
        return {
          query: this._clone(query),
          result: result
        };
      });
    }

    // private methods

    _clone(q) {
      let copiedItem = angular.copy(q.item);
      let m = new this._Query();
      m.internalize(copiedItem);
      return m;
    }

    _newQuery() {
      let m = new this._Query();
      m.initItem();
      return m;
    }
  }

  OpenReplService.$inject = ['$uibModal', 'Query', 'AceCompleters'];
  angular.module('alephServices.openReplService', []).service('OpenReplService', OpenReplService);

}(angular));
