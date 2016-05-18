!(angular => {
  'use strict';

  class VisualizationService {

    constructor(SourceRenderer, Visualization, Visualizations, LocalResource, $q) {
      this.visualization = new Visualization();
      this.visualizations = new Visualizations();
      this.sourceRenderer = new SourceRenderer(this.visualization);
      this.setResults = this.sourceRenderer.setResults.bind(this.sourceRenderer);

      this.presetDisplayList = [];
      this.presets = {};

      this._localResource = new LocalResource('visualization');
      this._$q = $q;
    }

    load(queryId, queryVersionId) {
      return this.visualizations
        .initCollection({
          query_id: queryId,
          query_version_id: queryVersionId
        })
        .then(visualizations => {
          if(_.exists(visualizations[0])) {
            this.visualization.internalize(visualizations[0].item);
          } else {
            this.visualization.initItem();
          }
          return visualizations;
        });
    }

    initService() {
      return this._loadPresets().then(this._loadTemplate.bind(this));
    }

    // private method

    _loadTemplate() {
      let _this = this;
      return this._localResource.get('template.json').then(response => {
        _this.sourceRenderer.setTemplate(response.data.template.join('\n'));
      });
    }

    _loadPresets() {
      let _this = this;
      return this._localResource.get('presets.json').then(response => {
          _this.presetDisplayList = _.keys(response.data);
          return response.data;
        }).then(presets => {
          return _this._$q.all(_.mapObject(presets, (file, name) => {
            _this._localResource.get(file).then(response => {
                _this.presets[name] = response.data;
                return response.data;
              });
          }));
        });
    }
  }

  VisualizationService.$inject = ['SourceRenderer', 'Visualization', 'Visualizations', 'LocalResource', '$q'];
  angular.module('alephServices.visualizationService', []).service('VisualizationService', VisualizationService);

}(angular));
