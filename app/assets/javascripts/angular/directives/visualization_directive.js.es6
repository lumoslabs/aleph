!(angular => {
  'use strict';

  class VisualizationController {

    constructor($sce, VisualizationService, DefaultAceConfigurator) {
      /* initialize visualization components and expose in controller */
      VisualizationService.initService();
      this.visualization = VisualizationService.visualization;
      this.visualizations = VisualizationService.visualizations;
      this.sourceRenderer = VisualizationService.sourceRenderer;
      VisualizationService.sourceRenderer.setResults(this.results);
      this.presetDisplayList = () => VisualizationService.presetDisplayList;
      this._service = VisualizationService;

      /* aceLoaded is bound to ui-ace config object */
      let _this = this;
      this.aceLoaded = function aceLoaded(editor) {
        new DefaultAceConfigurator(editor);
        editor.setOptions({
          maxLines: 40,
          minLines: 2
        });
        _this.aceEditor = editor;
      };

      this._$sce = $sce;
    }

    toggleEditor() {
      this.editorSelected = !this.editorSelected;

      // FIXME: we have to do this because ng-model on ace does not work while hidden
      if (this.editorSelected) {
        this.aceEditor.setValue(this.visualization.item.html_source, -1);
      }
    }

    renderedSource() {
      return this.sourceRenderer.isValid() ? this._$sce.trustAsHtml(this.sourceRenderer.rendered()) : '';
    }

    save() {
      // TODO: use bootbox.js to dress this up
      if(!this.visualization.hasTitle()) {
        let answer = prompt("Please enter a title for this visualization:");
        if (answer === null || answer === '') {
          return;
        }
        this.visualization.item.title = answer;
      }

      this.visualization.save(this.queryId, this.queryVersionId).then(() => {
        this.visualizations.initCollection({ query_id: this.queryId, query_version_id: this.queryVersionId });
      });
    }

    destroy() {
      this.visualization.destroy().then(() => {
        this._service.load(this.queryId, this.queryVersionId);
      });
    }

    selectVisualization(visualization) {
      this.visualization.internalize(visualization);
    }

    selectPreset(presetName) {
      if(this.visualization.isDirty()) {
        let answer = confirm('You are about to overwrite some unsaved changes, proceed?');
        if (!answer) return;
      }
      this.visualization.initItem().then(() => {
        this.visualization.item.html_source = this._service.presets[presetName];
      });
    }
  }

  VisualizationController.$inject = ['$sce', 'VisualizationService', 'DefaultAceConfigurator'];

  function visualizationComponent() {
    return {
      restrict: 'E',
      scope: {
        'queryId': '=',
        'queryVersionId': '=',
        'results': '='
      },
      templateUrl: 'visualization',
      controller: 'VisualizationController',
      controllerAs: 'vizShowCtrl',
      bindToController: true
    };
  }

  angular
    .module('alephDirectives.visualization', ['alephServices'])
    .controller('VisualizationController', VisualizationController)
    .directive('visualization', visualizationComponent);

}(angular));
