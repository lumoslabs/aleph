'use strict';

const TestUtils = {
  resolveHttp(resolve, value) {
    return resolve({ data: value });
  },

  classAndInstance(spyName, instance) {
    let c = jasmine.createSpy(spyName).and.returnValue(instance);
    return [c, instance];
  },

  spyAndReturn(obj, spyFn) {
    spyFn(obj);
    return obj;
  }
};
