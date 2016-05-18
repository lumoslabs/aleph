'use strict';

describe('Alert', () => {
  let Alert;
  let alert;
  let PollService;
  let standardModelSpies;
  let AlertResource;
  let digest;
  let $q;

  beforeEach(module('alephServices'));

  beforeEach(module($provide => {
    let provide = ProvisionHelper.withProvide($provide);

    PollService = provide.value('PollService', {
      poll: jasmine.createSpy('PollService.poll'),
      unPoll: jasmine.createSpy('PollService.unPoll')
    });

    standardModelSpies = provide.classSpyValue('StandardModel', SharedClassMocks.Model);
  }));

  beforeEach(inject((_Alert_, _AlertResource_, _$q_, $rootScope) => {
    digest = () => { $rootScope.$digest(); };
    $q = _$q_;

    Alert = _Alert_;
    alert = new Alert();
    AlertResource = _AlertResource_;
  }));

  describe('on construction', () => {
    it('passes resource and fields to super class constructor', () => {
      expect(alert.modelConstructorArgs[0]).toBe('alert');
      expect(alert.modelConstructorArgs[1]).toEqual(AlertResource);
    });
  });

  describe('#initItem', () => {
    beforeEach(() => {
      standardModelSpies.initItem = jasmine.createSpy('standardModelSpies.initItem');
      alert.initItem(1);
    });

    it('delegates to dirtyAwareModel.initItem', () => {
      expect(standardModelSpies.initItem).toHaveBeenCalledWith(1);
    });
  });

  describe('#save', () => {
    beforeEach(() => {
      alert.item = {
        title: 'fooAlert',
        status: 'whatever'
      };
    });

    describe('on save request', () => {
      beforeEach(() => {
        standardModelSpies.save = jasmine.createSpy('standardModelSpies.save')
          .and.returnValue($q.when({ id: 1 }));
        alert.save();
      });

      it('changes the status to pending', () => {
        expect(alert.item.status).toEqual('Pending');
      });

      it('delegates to dirtyAwareModel.save', () => {
        expect(standardModelSpies.save).toHaveBeenCalled();
      });
    });

    describe('on success', () => {
      beforeEach(() => {
        spyOn(alert, '_pollItem');
        standardModelSpies.save = jasmine.createSpy('standardModelSpies.save')
          .and.returnValue($q.when({ id: 1 }));
        alert.save();
        digest();
      });

      it('polls item', () => {
        expect(alert._pollItem).toHaveBeenCalledWith({ id: 1 });
      });
    });
  });
});
