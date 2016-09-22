'use strict';

describe('Results  Controller', () => {
  let ResultsController;
  let AlertFlash;
  let query;
  let ResultRunner;

  beforeEach(module('alephDirectives'));

  beforeEach(inject(($controller, _AlertFlash_) => {
    AlertFlash = _AlertFlash_;
    spyOn(AlertFlash, 'emitSuccess');

    ResultRunner = {
      run: jasmine.createSpy('ResultRunner.run')
    };

    query = {
      item: {
        id: 1,
        version: {
          id: 2
        }
      }
    };

    ResultsController = $controller('ResultsController', {}, {
      query: query,
      resultRunner: ResultRunner
    });
  }));

  describe('#runQuery', () => {
    beforeEach(() => {
      ResultsController.runQuery();
    });

    it('calls resultRunner.run', () => {
      expect(ResultRunner.run).toHaveBeenCalled();
    });
  });

  describe('#generateResultLink', () => {
    let linkUrl;
    beforeEach(() => {
      let result = {
        item: {
          id: 3
        }
      };

      ResultsController._hostname = 'my-host';
      linkUrl = ResultsController.generateResultLink(result);
    });

    it('the correct url string to be returned', () => {
      expect(linkUrl).toBe('my-host/results/query/1/query_version/2/result/3');
    });
  });

  describe('#alertCopied', () => {
    beforeEach(() => {
      ResultsController.alertCopied();
    });

    it('alerts user that link was copied', () => {
      expect(AlertFlash.emitSuccess).toHaveBeenCalledWith('Result link copied to clipboard!');
    });
  });
});
