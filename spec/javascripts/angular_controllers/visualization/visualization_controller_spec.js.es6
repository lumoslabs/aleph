'use strict';

describe('Visualization Controller', () => {
  let VisualizationController;
  let digest;
  let VisualizationService;
  let sourceRenderer;
  let visualization;
  let visualizations;
  let $window;
  let $sce;

  beforeEach(module('alephDirectives.visualization'));

  beforeEach(inject(($controller, _$sce_, _$window_, $rootScope, $q) => {
    digest = () => { $rootScope.$digest(); };

    $window = _$window_;
    $sce = _$sce_;

    // mocks
    sourceRenderer = {
      rendered: jasmine.createSpy('sourceRenderer.rendered'),
      setResults: jasmine.createSpy('sourceRenderer.setResults')
    };

    visualization = {
      item: {},
      internalize: jasmine.createSpy('visualization.internalize'),
      initItem: jasmine.createSpy('visualization.initItem').and.returnValue($q.when({})),
      save: jasmine.createSpy('visualization.save').and.returnValue($q.when('visualization.save')),
      destroy: jasmine.createSpy('visualization.destroy').and.returnValue($q.when('visualization.destroy'))
    };

    visualizations = {
      initCollection: jasmine.createSpy('visualizations.initCollection')
        .and.returnValue($q.when('visualizations.initCollection')),
    };

    VisualizationService = {
      sourceRenderer: sourceRenderer,
      visualization: visualization,
      visualizations: visualizations,
      initService: jasmine.createSpy('VisualizationService.initService'),
      load: jasmine.createSpy('VisualizationService.load')
    };

    // set up controller
    VisualizationController = $controller('VisualizationController', {
      $window: $window,
      VisualizationService: VisualizationService
    });

    VisualizationController.queryId = 1;
    VisualizationController.queryVersionId = 2;
  }));

  describe('on construction', () => {

    it('set VisualizationController.results on SourceRenderer', () => {
      expect(sourceRenderer.setResults).toHaveBeenCalledWith(VisualizationController.results);
    });
  });

  describe('#renderedSource', () => {
    beforeEach(() => {
      spyOn($sce, 'trustAsHtml');
    });

    describe('when SourceRenderer is valid', () => {
      beforeEach(() => {
        sourceRenderer.isValid = jasmine.createSpy('isValid').and.returnValue(true);
        VisualizationController.renderedSource();
      });

      it('delegates to sourceRenderer.rendered ', () => {
        expect(sourceRenderer.rendered).toHaveBeenCalled();
      });

      it('$sce.trustAsHtml is called', () => {
        expect($sce.trustAsHtml).toHaveBeenCalled();
      });
    });

    describe('when SourceRenderer is not valid', () => {
      let rendered;
      beforeEach(() => {
        sourceRenderer.isValid = jasmine.createSpy('isValid').and.returnValue(false);
        rendered = VisualizationController.renderedSource();
      });

      it('returns empty string', () => {
        expect(rendered).toBe('');
      });

      it('$sce.trustAsHtml is not called', () => {
        expect($sce.trustAsHtml).not.toHaveBeenCalled();
      });
    });
  });

  describe('#save', () => {
    describe('when no title exists (visualization.hasTitle)', () => {
      beforeEach(() => {
        spyOn($window, 'prompt').and.returnValue('prompt title');
        visualization.hasTitle = jasmine.createSpy('visualization.hasTitle').and.returnValue(false);
        VisualizationController.save();
      });

      it('prompts user for title and uses it to set title field on visualization item', () => {
        expect($window.prompt).toHaveBeenCalled();
        expect(visualization.item.title).toBe('prompt title');
      });
    });

    describe('when title exists', () => {
      beforeEach(() => {
        visualization.hasTitle = jasmine.createSpy('visualization.hasTitle').and.returnValue(true);
        VisualizationController.save();
        digest();
      });

      it('delegates to visualization.save', () => {
        expect(visualization.save).toHaveBeenCalledWith(1, 2);
      });

      it('it refreshes the collection', () => {
        expect(visualizations.initCollection).toHaveBeenCalledWith({
          query_id: 1,
          query_version_id: 2
        });
      });
    });
  });

  describe('#destroy', () => {
    beforeEach(() => {
      VisualizationController.destroy();
      digest();
    });

    it('calls visualization.destroy', () => {
      expect(visualization.destroy).toHaveBeenCalled();
    });

    it('it resets the model', () => {
      expect(VisualizationService.load).toHaveBeenCalledWith(1, 2);
    });
  });

  describe('#selectVisualization', () => {
    let item = { title: 'meh i am some visualization' };
    beforeEach(() => {
      VisualizationController.selectVisualization(item);
    });

    it('calls visualization.internalize on the item', () => {
      expect(visualization.internalize).toHaveBeenCalledWith(item);
    });
  });

  describe('#selectPreset', () => {
    function doSelectPreset() {
      VisualizationController.selectPreset('a');
      digest();
    }

    function behavesLikePresetSelected() {
      it('it makes a new item and sets the html source', () => {
        expect(visualization.initItem).toHaveBeenCalled();
        expect(visualization.item.html_source).toBe('a');
      });
    }

    beforeEach(() => {
      VisualizationService.presets = { a: 'a' };
      visualization.item = {
        title: '',
        html_source: ''
      };
    });

    describe('when the visualization is NOT dirty', () => {
      beforeEach(() => {
        visualization.isDirty = jasmine.createSpy('isDirty').and.returnValue(false);
        doSelectPreset();
      });

      behavesLikePresetSelected();
    });

    describe('when the visualization is dirty', () => {
      beforeEach(() => {
        visualization.isDirty = jasmine.createSpy('isDirty').and.returnValue(true);
      });

      describe('when user is willing to overwrite html_source', () => {
        beforeEach(() => {
          spyOn($window, 'confirm').and.returnValue(true);
          doSelectPreset();
        });

        it('pops up the confirm button', () => {
          expect($window.confirm).toHaveBeenCalled();
        });

        behavesLikePresetSelected();
      });

      describe('when user is NOT willing to overwrite html_source', () => {
        beforeEach(() => {
          spyOn($window, 'confirm').and.returnValue(false);
          doSelectPreset();
        });

        it('pops up the confirm button', () => {
          expect(window.confirm).toHaveBeenCalled();
        });

        it('it does not make a new item, nor set html_source', () => {
          expect(visualization.initItem).not.toHaveBeenCalled();
          expect(visualization.item.html_source).toBe('');
        });
      });
    });
  });
});
