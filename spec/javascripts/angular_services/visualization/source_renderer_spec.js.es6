'use strict';

describe('Visualization Source Renderer', () => {
  let SourceRenderer;
  let sourceRenderer;
  let visualization;
  let mockTemplate;

  beforeEach(module('alephServices'));

  beforeEach(inject(_SourceRenderer_ => {
    visualization = {};
    SourceRenderer = _SourceRenderer_;
    sourceRenderer = new SourceRenderer(visualization);
    mockTemplate = '<script><%= body %><%= result_id %></script>';
    spyOn(SerializedStorage, 'set');
  }));

  describe('#isValid', () => {
    describe('when visualization is falsy', () => {
      beforeEach(() => {
        visualization.hasSource = () => false;
      });

      it('returns falsy', () => {
        expect(sourceRenderer.isValid()).toBeFalsy();
      });
    });

    describe('when there is no latestResult', () => {
      beforeEach(() => {
        visualization.hasSource = () => true;
        spyOn(sourceRenderer, 'latestResult').and.returnValue(undefined);
      });

      it('returns falsy', () => {
        expect(sourceRenderer.isValid()).toBeFalsy();
      });
    });

    describe('when there is no template', () => {
      beforeEach(() => {
        visualization.hasSource = () => true;
        spyOn(sourceRenderer, 'latestResult').and.returnValue({ do: 'something' });
        sourceRenderer._compiledTemplate = undefined;
      });

      it('returns falsy', () => {
        expect(sourceRenderer.isValid()).toBeFalsy();
      });
    });
  });

  describe('#latestResult', () => {
    it('returns the result with highest id where status is complete', () => {
      sourceRenderer.setResults({
        items: () => [
          {
            id: 14,
            status: 'failed'
          },
          {
            id: 10,
            status: 'complete'
          },
          {
            id: 33,
            status: 'pending'
          }
        ]
      });

      expect(sourceRenderer.latestResult().id).toBe(10);

      sourceRenderer.setResults({
        items: () => [
          {
            id: 100,
            status: 'pending'
          },
          {
            id: 14,
            status: 'complete'
          },
          {
            id: 33,
            status: 'complete'
          },
          {
            id: 45,
            status: 'pending'
          }
        ]
      });

      expect(sourceRenderer.latestResult().id).toBe(33);
    });

    it('returns undefined if no results are done', () => {
      sourceRenderer.setResults({ items: () => [] });
      expect(sourceRenderer.latestResult()).toBe(undefined);
    });
  });

  describe('#rendered', () => {
    let rendered;
    beforeEach(() => {
      sourceRenderer.setResults({
        items: () => [{
          id: 666,
          status: 'complete',
          sample_data: [[1, 2]],
          headers: ['a','b']
        }]
      });

      visualization.hasSource = () => true;
      visualization.item = { html_source: 'source body' };
      sourceRenderer.setTemplate(mockTemplate);
      rendered = sourceRenderer.rendered();
    });

    it('internalizes result data to SerializedStorage', () => {
      expect(SerializedStorage.set.calls.allArgs())
        .toEqual([
          ['DATASET', [[1, 2]]],
          ['COLUMNS', [['a', 1], ['b', 2]]],
          ['HEADERS', ['a', 'b']]
        ]);
    });

    it('renders correctly', () => {
      expect(rendered).toEqual('<script>source body666</script>');
    });
  });
});
