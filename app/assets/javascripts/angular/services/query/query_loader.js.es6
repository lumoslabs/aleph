!(angular => {
  'use strict';

  class QueryLoader {
    constructor($routeParams, Query, QueryVersions, Results, VisualizationService) {
      this._Query = Query;
      this._QueryVersion = QueryVersions;
      this._Results = Results;
      this._VisualizationService = VisualizationService;
      this._$routeParams = $routeParams;
    }

    initialize() {
      this.query = new this._Query();
      this.queryVersions = new this._QueryVersion();
      this.results = new this._Results();
      this.queryId = this._$routeParams.query_id;
      this.queryVersionId = this._$routeParams.query_version_id || 'latest';
    }

    load() {
      return this.query.initItem(this.queryId, this.queryVersionId)
        .then(this.loadQueryVersions.bind(this))
        .then(this.loadResults.bind(this))
        .then(this.loadVisualizations.bind(this));
    }

    loadQueryVersions(query) {
      return this.queryVersions.initCollection(query.id).then(versions => {
        return { query: query, queryVersions: versions };
      });
    }

    loadResults(prev) {
      let query = prev.query;
      return this.results.initCollection({
        query_id: query.id,
        query_version_id: query.version.id
      }).then(results => {
        return _.merge(prev, { results: results });
      });
    }

    loadVisualizations(prev) {
      let query = prev.query;
      return this._VisualizationService.load(query.id, query.version.id).then(visualizations => {
        return _.merge(prev, { visualizations: visualizations });
      });
    }
  }

  QueryLoader.$inject = ['$routeParams', 'Query', 'QueryVersions', 'Results', 'VisualizationService'];
  angular.module('alephServices.queryLoader', []).service('QueryLoader', QueryLoader);
}(angular));
