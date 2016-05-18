!(angular => {
  'use strict';

  function ResultRunnerImports(AlertFlash) {

    return class ResultRunner {

      constructor(query, results, options = {}) {
        this.sandbox = options.sandbox ;
        this.substitutionValues = options.substitutionValues || {};
        this.results = results;
        this.query = query;

        this.enableAlert = options.enableAlert || false;
        this.enablePolling = options.enablePolling || false;
      }

      get queryId() { return this.sandbox ? undefined : this.query.item.id; }
      get queryVersionId() { return this.sandbox ? undefined : this.query.item.version.id; }
      get body() { return this.sandbox ? this.query.item.version.body : undefined; }
      get parameters() { return this.sandbox ? this.query.item.version.parameters : undefined; }

      run() {
        let Result = this.results.Model;
        let result = new Result();
        return result.save(this.queryId, this.queryVersionId, {
          substitution_values: this.substitutionValues,
          body: this.body,
          parameters: this.parameters,
          sandbox: this.sandbox
        }).then(result => {
          if(this.enableAlert) {
            AlertFlash.emitInfo('Started running result, id = ' + result.id);
          }

          let resultModel = this.results.add(result);
          if(this.enablePolling) {
            resultModel.poller.poll();
          }
          return result;
        });
      }
    };
  }

  ResultRunnerImports.$inject = ['AlertFlash'];
  angular.module('alephServices.resultRunner', []).service('ResultRunner', ResultRunnerImports);
}(angular));
