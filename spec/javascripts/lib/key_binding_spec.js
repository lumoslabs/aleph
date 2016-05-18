'use strict';

describe('KeyBinding', function() {
  var keyBinding,
    keyName,
    keyBindKey,
    keyFn,
    keyBindingWithKeyFn;

  beforeEach(function() {
    keyName = 'MyKey';
    keyBindKey = {mac: 'command-shift-m', win: 'ctrl-shift-m'};
    keyBinding = new KeyBinding(keyName, keyBindKey);
  });

  it('intializes correctly', function() {
    expect(keyBinding.name).toEqual(keyName);
    expect(keyBinding.bindKey).toEqual(keyBindKey);
  });

  describe('#withKeyFn', function() {
    beforeEach(function() {
      keyFn = function() {};
      keyBindingWithKeyFn = keyBinding.withKeyFn(keyFn);
    });

    it('sets name, bindKey, and keyFn fields', function() {
      expect(keyBindingWithKeyFn.keyFn).toEqual(keyFn);
      expect(keyBindingWithKeyFn.name).toEqual(keyName);
      expect(keyBindingWithKeyFn.bindKey).toEqual(keyBindKey);
    });

    it('sets up the ace key command object correctly', function() {
      expect(keyBindingWithKeyFn.aceKeyCmd).toEqual({
        name: keyName,
        bindKey: keyBindKey,
        exec: keyFn
      });
    });

    it('sets up the hotKey object correctly', function() {
      expect(keyBindingWithKeyFn.hotKey).toEqual({
        combo: ['command-shift-m', 'ctrl-shift-m'],
        description: keyName,
        callback: keyFn
      });
    });
  });
});
