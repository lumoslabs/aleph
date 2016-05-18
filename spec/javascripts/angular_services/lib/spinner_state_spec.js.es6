'use strict';

describe('Spinner State', () => {
  let SpinnerState;
  let spinner;

  beforeEach(module('aleph'));

  beforeEach(inject( _SpinnerState_ => {
    SpinnerState = _SpinnerState_;
  }));

  describe('#withContext', () => {
    beforeEach(() => {
      spinner = SpinnerState.withContext('someContext');
    });

    it('creates an object with #on and #off functions', () => {
      expect(_.isFunction(spinner.on)).toBeTruthy();
      expect(_.isFunction(spinner.off)).toBeTruthy();
    });

    it('sets spinner.context', () => {
      expect(spinner.context).toBe('someContext');
    });

    it('#isActive returns properly if spinner has been set on or off', () => {
      spinner.on();
      expect(SpinnerState.isActive()).toBeTruthy();
      spinner.off();
      expect(SpinnerState.isActive()).toBeFalsy();
    });
  });
});
