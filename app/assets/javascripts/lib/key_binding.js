'use strict';

function KeyBinding(_name, _bindKey) {
  this.name = _name;
  this.bindKey = _bindKey;
}

KeyBinding.prototype.withKeyFn = function(_keyFn) {
  return {
    name: this.name,
    bindKey: this.bindKey,
    keyFn: _keyFn,
    aceKeyCmd: {
      name: this.name,
      bindKey: this.bindKey,
      exec: _keyFn
    },
    hotKey: {
      combo: _.toArray(this.bindKey),
      description: this.name,
      callback: _keyFn
    }
  };
};
