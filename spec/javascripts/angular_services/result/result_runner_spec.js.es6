'use strict';

describe('Result Runner', () => {
  let ResultRunner;
  let resultRunner;
  let Result;
  let result;
  let results;
  let AlertFlash;
  let digest;
  let query;
  let substitutionValues;
  let parameters;
  let newResult;
  let callback;
  let addedResult;

  beforeEach(module('alephServices'));

  beforeEach(module($provide => {
    let provide = ProvisionHelper.withProvide($provide);
    AlertFlash = provide.value('AlertFlash', SharedMocks.AlertFlash);
  }));

  beforeEach(inject((_ResultRunner_, $rootScope, $q) => {
    digest = () => { $rootScope.$digest(); };
    ResultRunner = _ResultRunner_;


    callback = jasmine.createSpy('callback');

    newResult = {};
    [Result, result] = TestUtils.classAndInstance('Result', {
      save: jasmine.createSpy('result.save').and.returnValue($q.when(newResult))
    });

    addedResult = {
      poller: {
        poll: jasmine.createSpy('result.poller.poll')
      }
    };

    results = {
      Model: Result,
      add: jasmine.createSpy('results.add').and.returnValue(addedResult)
    };

    substitutionValues = { substitute: 'deez nuts' };
    parameters = [ { name: 'substitute', type: 'raw', default: 'doze nuts'} ];
    query = {
      item: {
        id: 1,
        title: 'i smell a psychosphere',
        version: {
          id: 2,
          body: 'time is a flat circle',
          parameters: parameters
        }
      }
    };
  }));

  describe('#run in the context of an extant query (aka, not in the REPL)', () => {
    beforeEach(() => {
      resultRunner = new ResultRunner(query, results, {
        substitutionValues: substitutionValues,
        enableAlert: true
      });

      resultRunner.run().then(callback);
    });

    it('a new result model is constructed', () => {
      expect(Result).toHaveBeenCalled();
    });

    it('calls result.save correctly', () => {
      expect(result.save).toHaveBeenCalledWith(1, 2, {
        substitution_values: substitutionValues,
        body: undefined,
        parameters: undefined,
        sandbox: undefined
      });
    });

    describe('on success', () => {
      beforeEach(() => {
        digest();
      });

      it('adds the result to results', () => {
        expect(results.add).toHaveBeenCalledWith(newResult);
      });

      it('returns the new result down the promise chain', () => {
        expect(callback).toHaveBeenCalledWith(newResult);
      });

      it('an info message about the result running is emitted', () => {
        expect(AlertFlash.emitInfo).toHaveBeenCalled();
      });
    });
  });

  describe('#run in a REPL (sandbox) w/ enableDisabled', () => {
    beforeEach(() => {
      resultRunner = new ResultRunner(query, results, {
        sandbox: true,
        enablePolling: true,
        substitutionValues: substitutionValues
      });

      resultRunner.run().then(callback);
    });

    it('a new result model is constructed', () => {
      expect(Result).toHaveBeenCalled();
    });

    it('calls result.save correctly', () => {
      expect(result.save).toHaveBeenCalledWith(undefined, undefined, {
        body: 'time is a flat circle',
        parameters: parameters,
        substitution_values: substitutionValues,
        sandbox: true
      });
    });

    describe('on success', () => {
      beforeEach(() => {
        digest();
      });

      it('adds the result to results', () => {
        expect(results.add).toHaveBeenCalledWith(newResult);
      });

      it('calls result.poller.poll', () => {
        expect(addedResult.poller.poll).toHaveBeenCalled();
      });

      it('returns the new result down the promise chain', () => {
        expect(callback).toHaveBeenCalledWith(newResult);
      });
    });
  });
});
