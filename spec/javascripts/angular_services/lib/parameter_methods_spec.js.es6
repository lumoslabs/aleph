'use strict';

describe('ParameterMethods', () => {
  let ParameterMethods;
  let parameters;

  beforeEach(module('alephServices'));

  beforeEach(inject(_ParameterMethods_ => {
    ParameterMethods = _ParameterMethods_;
    parameters = [];
  }));

  it('#constructParameter constructs a parameter object', () => {
    expect(ParameterMethods.constructParameter()).toEqual({name: undefined, type: 'raw'});
    expect(ParameterMethods.constructParameter('meh')).toEqual({name: 'meh', type: 'raw'});
  });

  it('#detectParameters parses parameters into the parameters array passed in', () => {
    ParameterMethods.detectParameters('select zits from {ur_face} limit {no_limit_soldiers}', parameters);
    expect(parameters).toContain({name: 'no_limit_soldiers', type: 'raw'});
    expect(parameters).toContain({name: 'ur_face', type: 'raw'});
  });
});
