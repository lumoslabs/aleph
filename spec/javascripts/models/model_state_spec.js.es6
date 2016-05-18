'use strict';

describe('ModelState', () => {
  let ModelState;
  let modelState;

  beforeEach(module('models'));

  beforeEach(inject(_ModelState_ => {
    ModelState = _ModelState_;
    modelState = new ModelState(['x', 'y']);

    spyOn(angular, 'copy').and.callThrough();
  }));

  describe('on constructor', () => {
    it('defaults comparators if none are passed in', () => {
      expect(_.keys(modelState._comparators).length).toEqual(2);
    });
  });

  describe('#snapshotItem', () => {
    let item;

    beforeEach(() => {
      item = { x: 'x', y: 'y' };
      modelState.snapshotItem(item);
    });

    it('copies item', () => {
      expect(angular.copy).toHaveBeenCalledWith(item);
    });

    it('populates snapshot field with the copy', () => {
      expect(modelState.snapshot).toEqual(item);
      expect(modelState.snapshot).not.toBe(item);
    });

    it('#isPristine returns true', () => {
      expect(modelState.isPristine(item)).toBeTruthy();
    });

    describe('and then mutate item state', () => {
      beforeEach(() => {
        item.x = 'some other x';
      });

      it('#isPristine returns false', () => {
        expect(modelState.isPristine(item)).toBeFalsy();
      });
    });
  });
});
