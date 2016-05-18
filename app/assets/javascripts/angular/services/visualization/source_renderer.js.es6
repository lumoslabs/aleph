!(angular => {
  'use strict';

  class SourceRenderer {

    constructor(visualization) {
      this._visualization = visualization;
    }

    setTemplate(template) {
      this._compiledTemplate = _.template(template);
    }

    setResults(results) {
      this.results = results;
    }

    latestResult() {
      let latestResult;

      _(this.results.items())
        .sortBy('id')
        .reverse()
        .forEach(result => {
          if (!_.exists(latestResult) && result.status === 'complete') {
            latestResult = result;
          }
        });

      return latestResult;
    }

    isValid() {
      return this._visualization.hasSource() && this.latestResult() && _.exists(this._compiledTemplate);
    }

    rendered() {
      let result = this.latestResult();
      if(this._visualization.hasSource() && result && _.exists(this._compiledTemplate)) {
        this._internalizeToLocalStorage(result);
        return this._compiledTemplate({
          result_id: result.id,
          panel: '#chart-panel',
          body: this._visualization.item.html_source
        });
      } else {
        return null;
      }
    }

    // private methods

    _internalizeToLocalStorage(result) {
      SerializedStorage.set('DATASET', result.sample_data);
      SerializedStorage.set('COLUMNS', this._toColumns(result.headers, result.sample_data));
      SerializedStorage.set('HEADERS', result.headers);
    }

    _toColumns(headers, dataset) {
      let arr = [];
      headers.forEach((header, idx) => {
        arr.push([header].concat(dataset.map(row => row[idx])));
      });
      return arr;
    }
  }

  angular.module('alephServices.sourceRenderer', []).service('SourceRenderer', () => SourceRenderer);

}(angular));
