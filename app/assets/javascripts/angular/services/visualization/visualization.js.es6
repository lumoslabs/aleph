!(angular => {
  'use strict';

  function VisualizationImports(ModelManager) {

    let VisualizationBase = ModelManager.forModelName('visualization').modelClass();
    return class Visualization extends VisualizationBase {

      constructor() {
        super();
        this.hasSource  = this.itemHas.bind(this, 'html_source');
        this.hasTitle   = this.itemHas.bind(this, 'title');
      }

      itemHas(property) {
        return Utils.stringHelpers.isPresent(this.item[property]);
      }

      save(queryId, queryVersionId) {
        return this._save(queryId, queryVersionId);
      }

      destroy() {
        return super.destroy().then(() => this.initItem());
      }

      // private methods

      _save(queryId, queryVersionId) {
        if(this.isPersisted()) {
          return super.update(this.item);
        } else {
          let createParams = _.merge({
            query_id: queryId,
            query_version_id: queryVersionId
          }, this.item);

          return super.create(createParams);
        }
      }
    };
  }

  VisualizationImports.$inject = ['ModelManager'];
  angular.module('alephServices.visualization', []).service('Visualization', VisualizationImports);

}(angular));
