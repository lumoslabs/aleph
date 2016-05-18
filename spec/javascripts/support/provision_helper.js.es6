'use strict';

const ProvisionHelper = {

  withProvide($provide) {
    this._$provide = $provide;
    return this;
  },

  value(name, obj) {
    this._$provide.value(name, obj);
    return obj;
  },

  classAndInstanceValue(name, instance) {
    let c = jasmine.createSpy(name).and.returnValue(instance);
    this._$provide.value(name, c);
    return [c, instance];
  },

  classSpyValue(name, mockClass) {
    let spies = {};
    this._$provide.value(name, mockClass(spies));
    return spies;
  }
};
