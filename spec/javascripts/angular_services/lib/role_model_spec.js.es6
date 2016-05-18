'use strict';

describe('Role Model', () => {
  let RoleModel;
  let $resource;
  let digest;
  let callback;

  beforeEach(module('alephServices'));

  beforeEach(inject((_RoleModel_, $rootScope, $q)=> {
    RoleModel = _RoleModel_;
    $resource = RoleModel._resource;
    digest = () => { $rootScope.$digest(); };
    callback = jasmine.createSpy('callback');

    spyOn($resource, 'query').and.returnValue({
      $promise: $q.when([ 'role_X', 'role_Y' ])
    });
  }));

  describe('#initCollection', () => {
    beforeEach(() => {
      RoleModel.initCollection().then(callback);
      digest();
    });

    it('calls resource.query', () => {
      expect($resource.query).toHaveBeenCalled();
    });

    describe('on response', () => {
      beforeEach(() => {
        digest();
      });

      it('it sets collection', () => {
        expect(RoleModel.collection).toEqual([ 'role_X', 'role_Y' ]);
      });

      it('passes roles to callback', () => {
        expect(callback).toHaveBeenCalledWith([ 'role_X', 'role_Y' ]);
      });
    });
  });
});
