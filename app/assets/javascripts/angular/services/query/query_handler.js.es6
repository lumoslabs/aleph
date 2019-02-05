!(angular => {
  'use strict';

  class QueryHandler {
    constructor($location, AlertFlash, $q) {
      this._alertFlash = AlertFlash;
      this._$location = $location;
      this._$q = $q;
    }

    success(action, schedule, query) {
      let _action =  action || 'action';
      let _schedule = _.exists(schedule) ? schedule : false;

      this._alertFlash.emitSuccess('Query "' + query.item.title + '" ' + _action + 'd!', _schedule);
      return query;
    }

    handleReplExit(error) {
      if(error === 'QueryReplExit') {
        // consume the error
        this._alertFlash.emitInfo('Exited editing REPL without saving', false);
      } else {
        return this._$q.reject(error);
      }
    }

    navigateToLatestVersion(query) {
      this._$location.path('/queries/' + query.item.id + '/query_versions/' + query.item.version.id);
      return query;
    }

    navigateToIndex() {
      this._$location.path('/queries');
    }
  }

  QueryHandler.$inject = ['$location', 'AlertFlash', '$q'];
  angular.module('alephServices.queryHandler', []).service('QueryHandler', QueryHandler);
}(angular));
