'use strict';

describe('TagFactory', () => {
  let $httpBackend;
  let TagResource;

  beforeEach(angular.mock.module('alephServices'));

  beforeEach(() => {
    angular.mock.inject(function ($injector) {
      $httpBackend = $injector.get('$httpBackend');
      TagResource = $injector.get('TagResource');
    });
  });

  describe('resource.index', () => {
    let result;
    beforeEach(() => {
      $httpBackend.expectGET('/tags.json')
        .respond([{
          name: 'test',
          id: 1
        }]);

      result = TagResource.index();
      $httpBackend.flush();
    });

    it('should make a call to /tags with the GET verb and return the resulting array', () => {
      expect(result[0].name).toEqual('test');
    });
  });
});
