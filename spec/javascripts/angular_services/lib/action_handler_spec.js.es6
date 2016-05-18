'use strict';

describe('Action Handler', () => {
  let ActionHandler;
  let actionHandler;
  let AlertFlash;
  let SpinnerState;
  let spinner;
  let digest;
  let promiseKeeper;
  let promiseBreaker;
  let callback;

  beforeEach(module('alephServices'));

  beforeEach(inject((_ActionHandler_, _AlertFlash_, _SpinnerState_, $rootScope, $q) => {
    ActionHandler = _ActionHandler_;

    AlertFlash = _AlertFlash_;
    spyOn(AlertFlash, 'emitDanger');

    callback = jasmine.createSpy('callback');
    digest = () => { $rootScope.$digest(); };
    promiseKeeper = jasmine.createSpy('promiseKeeper').and.returnValue($q.when('success'));
    promiseBreaker = jasmine.createSpy('promiseBreaker').and.returnValue($q.reject('failure'));

    spinner = {
      on: jasmine.createSpy('spinner.on'),
      off: jasmine.createSpy('spinner.off')
    };
    SpinnerState = _SpinnerState_;
    spyOn(SpinnerState, 'withContext').and.returnValue(spinner);
  }));

  describe('action handler for a model', () => {
    describe('where model item has a title', () => {
      beforeEach(() => {
        actionHandler = new ActionHandler('Ryu', {
          modelItem: () => {
            return { title: 'hadouken!' };
          }
        });
      });

      describe('with an action which will fail', () => {
        beforeEach(() => {
          actionHandler.wrapAction('upper-cutting', promiseBreaker).catch(callback);
        });

        it('calls spinner.on', () => {
          expect(spinner.on).toHaveBeenCalled();
        });

        it('wrapped function is called', () => {
          expect(promiseBreaker).toHaveBeenCalled();
        });

        describe('and on failure', () => {
          beforeEach(() => {
            digest();
          });

          it('a somewhat informative msg is send to AlertFlash', () => {
            expect(AlertFlash.emitDanger).toHaveBeenCalledWith('Failed upper-cutting Ryu, title = hadouken!');
          });

          it('it propigates the error on', () => {
            expect(callback).toHaveBeenCalledWith('failure');
          });

          it('call spinner off', () => {
            expect(spinner.off).toHaveBeenCalled();
          });
        });
      });
    });
  });
});
