'use strict';

describe('Utils', function() {

  describe('arrayHelpers', function() {

    describe('#removeItem', function() {
      var collection,
        findFn;

      beforeEach(function() {
        collection = ['x', 'y', 'b', 'd', 'r'];
        findFn = function(check, element) { return element === check; };
      });

      it('removes item from middle of collection in place w/ stable sorting if it can find it', function() {
        Utils.arrayHelpers.removeItem(collection, _.partial(findFn, 'y'));
        expect(collection).toEqual(['x', 'b', 'd', 'r']);
      });

      it('removes item from front of collectiion in place w/ stable sorting if it can find it', function() {
        Utils.arrayHelpers.removeItem(collection, _.partial(findFn, 'x'));
        expect(collection).toEqual(['y', 'b', 'd', 'r']);
      });

      it('removes item from end of collection in place w/ stable sorting if it can find it', function() {
        Utils.arrayHelpers.removeItem(collection, _.partial(findFn, 'r'));
        expect(collection).toEqual(['x', 'y', 'b', 'd']);
      });

      it('does not remove item from collection in place if it cannot find it', function() {
        Utils.arrayHelpers.removeItem(collection, _.partial(findFn, 'randomStringZZZ'));
        expect(collection).toBe(collection);
      });
    });

    describe('#compare', function() {
      it('returns false if array sizes are different', function() {
        expect(Utils.arrayHelpers.compare([1, 2, 3],[1, 2])).toBe(false);
      });

      describe('for primitives', function() {

        it('returns true if exactly same elements exist regardless of order', function() {
          expect(Utils.arrayHelpers.compare([1, 2, 3],[2, 3, 1])).toBe(true);
        });

        it('returns false if not the same elements exist', function() {
          expect(Utils.arrayHelpers.compare([1, 2, 3],[2, 3, 5])).toBe(false);
        });
      });

      it('works for objects if you provide an iteratee function', function() {
        expect(
          Utils.arrayHelpers.compare(
            [ { k: 1 }, { k: 2 }, { k: 3 } ],
            [ { k: 2 }, { k: 3 }, { k: 1 } ],
            function(element) {
              return element.k;
            }
          )
        ).toBe(true);
      });
    });
  });

  describe('stringHelpers', function() {

    describe('#isPresent', function() {
      it('returns false if string is undefined', function() {
        expect(Utils.stringHelpers.isPresent(undefined)).toBeFalsy();
      });

      it('returns false if string is null', function() {
        expect(Utils.stringHelpers.isPresent(null)).toBeFalsy();
      });

      it('returns false if string is only whitespace', function() {
        expect(Utils.stringHelpers.isPresent('  ')).toBeFalsy();
      });

      it('returns true if string has something besides whitespace', function() {
        expect(Utils.stringHelpers.isPresent(' x ')).toBeTruthy();
      });
    });

  });
});
