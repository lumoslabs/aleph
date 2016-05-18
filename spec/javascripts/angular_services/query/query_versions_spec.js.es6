'use strict';

describe('QueryVersions', () => {
  let QueryVersions;
  let queryVersions;
  let resource;
  let collectionModelBaseSpies;
  let UnpersistedModel;

  beforeEach(module('alephServices'));

  beforeEach(module($provide => {
    let provide = ProvisionHelper.withProvide($provide);

    resource = { query: jasmine.createSpy('resource.query') };
    $provide.value('$resource', jasmine.createSpy('$resource').and.returnValue(resource));

    collectionModelBaseSpies = provide.classSpyValue('CollectionModelBase', SharedClassMocks.CollectionModel);
  }));

  beforeEach(inject((_QueryVersions_, _UnpersistedModel_) => {
    QueryVersions = _QueryVersions_;
    queryVersions = new QueryVersions();
    UnpersistedModel = _UnpersistedModel_;
    collectionModelBaseSpies.initCollection = jasmine.createSpy('mockCollectionModelBase.initCollection');
  }));

  describe('on construction', () => {
    it('CollectionModelBase constructor is called', () => {
      expect(queryVersions.collectionModelConstructorArgs[0]).toEqual({ index: resource.query });
      expect(queryVersions.collectionModelConstructorArgs[1]).toEqual(UnpersistedModel);
    });
  });

  describe('#initCollection', () => {
    beforeEach(() => {
      queryVersions.initCollection(1);
    });

    it('delegate to CollectionModelBase.initCollection', () => {
      expect(collectionModelBaseSpies.initCollection).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
