!(angular => {
  'use strict';

  function ResultImport(ModelManager, ResultPoller) {

    let ResultBase = ModelManager.forModelName('result').modelClass();
    return class Result extends ResultBase {
      constructor() {
        super();
        this.poller = new ResultPoller(this);
      }

      save(queryId, queryVersionId, options) {
        let params = _.merge({
          query_id: queryId,
          query_version_id: queryVersionId
        }, (options || {}));

        return super.create(params);
      }
    };
  }

  ResultImport.$inject = ['ModelManager', 'ResultPoller'];
  angular.module('alephServices.result', []).service('Result', ResultImport);
}(angular));
