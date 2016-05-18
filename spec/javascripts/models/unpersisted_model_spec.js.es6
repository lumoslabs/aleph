'use strict';

describe('UnpersistedModel', () => {
  let UnpersistedModel;
  let model;

  beforeEach(module('models'));

  beforeEach(inject(_UnpersistedModel_ => {
    UnpersistedModel = _UnpersistedModel_;
    model = new UnpersistedModel();
  }));

  describe('#internalize', () => {
    beforeEach(() => {
      model.internalize('a');
    });

    it('set item', () => {
      model.item = 'a';
    });
  });

  describe('#save', () => {
    it('throws an error because it is not implemented', () => {
      expect(model.save).toThrow('Cannot save an unpersisted model');
    });
  });
});
