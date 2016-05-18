'use strict';

describe('Visualization Service', () => {
  let VisualizationService;
  let SourceRenderer;
  let sourceRenderer;
  let Visualizations;
  let visualizations;
  let Visualization;
  let visualization;
  let LocalResource;
  let localResource;
  let digest;
  let resolveHttp;
  let $q;

  beforeEach(module('alephServices'));

  beforeEach(module($provide => {
    let provide = ProvisionHelper.withProvide($provide);

    [Visualizations, visualizations] = provide.classAndInstanceValue('Visualizations', {});

    [Visualization, visualization] = provide.classAndInstanceValue('Visualization', {
      internalize: jasmine.createSpy('Visualization.internalize')
    });

    [SourceRenderer, sourceRenderer] = provide.classAndInstanceValue('SourceRenderer', {
      setResults: jasmine.createSpy('SourceRenderer.setResults'),
      setTemplate: jasmine.createSpy('SourceRenderer.setTemplate'),
    });

    [LocalResource, localResource] = provide.classAndInstanceValue('LocalResource', {
      get: jasmine.createSpy('LocalResource.get').and.callFake(resource => {
        switch(resource) {
          case 'presets.json':
            return resolveHttp({
              'My Chart': 'my_chart.html'
            });

          case 'my_chart.html':
            return resolveHttp('Chart Html Blah blah');

          case 'template.json':
            return resolveHttp({
              template: ['a','b','c']
            });
        }
      })
    });
  }));

  beforeEach(inject((_VisualizationService_, _$q_, $rootScope) => {
    digest = () => { $rootScope.$digest(); };
    $q = _$q_;
    resolveHttp = _.partial(TestUtils.resolveHttp, $q.when);
    VisualizationService = _VisualizationService_;
  }));

  describe('on construction', () => {
    it('constructs visualizations', () => {
      expect(Visualizations).toHaveBeenCalled();
    });

    it('constructs visualization', () => {
      expect(Visualization).toHaveBeenCalled();
    });

    it('constructs sourceRenderer', () => {
      expect(SourceRenderer).toHaveBeenCalledWith(visualization);
    });
  });

  describe('#initService', () => {
    beforeEach(() => {
      VisualizationService.initService(1, 2);
      digest();
    });

    it('loads presets', () => {
      expect(localResource.get).toHaveBeenCalledWith('presets.json');
      expect(localResource.get).toHaveBeenCalledWith('my_chart.html');
      expect(VisualizationService.presets).toEqual({'My Chart': 'Chart Html Blah blah'});
    });

    it('loads templates', () => {
      expect(localResource.get).toHaveBeenCalledWith('template.json');
    });

    it('sets template on source renderer', () => {
      expect(sourceRenderer.setTemplate).toHaveBeenCalledWith("a\nb\nc");
    });
  });

  describe('#load', () => {
    let visualizationItem;
    beforeEach(() => {
      visualizationItem = {
        id: 1,
        title: 'meh',
        html_source: 'more meh'
      };

      visualizations.initCollection = jasmine.createSpy('Visualizations.initCollection')
        .and.returnValue($q.when( [{ item: visualizationItem }] ));
      VisualizationService.load(3, 4);
      digest();
    });

    it('initialized model collection', () => {
      expect(visualizations.initCollection).toHaveBeenCalledWith({
        query_id: 3,
        query_version_id: 4
      });
    });

    it('visualization item is internalized by visualization', () => {
      expect(visualization.internalize).toHaveBeenCalledWith(visualizationItem);
    });
  });
});
