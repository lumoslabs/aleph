'use strict';

describe('MatcherRunner', () => {
  let mockMatchers;
  let items;
  let matcherRunner;
  let context;

  beforeEach(module('alephServices'));

  beforeEach(inject(_MatcherRunner_ => {
    function mockFilter(item, filterArgs) {
      return (item.color !== filterArgs.blockedColor);
    }

    mockMatchers = [
      {
        nameProperty: 'name',
        meta: 'sampleMatcherMeta',
        contextRelevance: {
          sampleContext: 1000
        },
        contextItemFilters: {
          sampleContext: [
            mockFilter
          ]
        }
      }
    ];

    items = [
      {name: 'apples', color: 'red'},
      {name: 'pears', color: 'green'},
      {name: 'grapes', color: 'green'}
    ];

    let MatcherRunner = _MatcherRunner_;
    matcherRunner = new MatcherRunner(mockMatchers, items);
  }));

  describe('.execute', () => {
    describe("when one of the matcher's contexts is the one that is passed", () => {
      beforeEach(() => { context = 'sampleContext'; });

      it('finds the items that start with the prefix', () => {
        expect(matcherRunner.execute(context, {blockedColor: 'green'}, 'a')[0].name).toBe('apples');
      });

      it("assigns that context's value as the score of the matches", () => {
        expect(matcherRunner.execute(context, {blockedColor: 'green'}, 'a')[0].score).toBe(1000);
      });

      it("it assigns the matcher's meta as the meta of the matches", () => {
        expect(matcherRunner.execute(context, {blockedColor: 'green'}, 'a')[0].meta).toBe('sampleMatcherMeta');
      });

      describe('when a filter is in the context and that filter returns false for an item', () => {
        it('does not match that item', () => {
          expect(matcherRunner.execute(context, {blockedColor: 'red'}, 'a').length).toBe(0);
        });
      });
    });

    describe('when the passed context is not listed on a matcher' , () => {
      beforeEach(() => { context = 'otherContext'; });

      it('does not run that matcher', () => {
        expect(matcherRunner.execute(context, {blockedColor: 'green'}, 'a').length).toBe(0);
      });
    });
  });
});
