'use strict';

describe('Local Resource', () => {
  let LocalResource;
  let localResourceInstance;
  let http;
  let digest;

  beforeEach(module('alephServices'));

  beforeEach(inject((_LocalResource_, $http) => {
    LocalResource = _LocalResource_;
    http = $http;
    spyOn(http, 'get');
  }));

  describe('on construction', () => {
    beforeEach(() => {
      localResourceInstance = new LocalResource('x', 'y');
    });

    it('sets the path correctly', () => {
      expect(localResourceInstance.path).toEqual(['resources', 'x', 'y']);
    });
  });

  describe('#get', () => {
    beforeEach(() => {
      localResourceInstance = new LocalResource();
      localResourceInstance.get('meh.file');
    });

    it('calls with correct path', () => {
      expect(http.get).toHaveBeenCalledWith('resources/meh.file');
    });

    it('does not alter path', () => {
      expect(localResourceInstance.path).toEqual(['resources']);
    });
  });
});
