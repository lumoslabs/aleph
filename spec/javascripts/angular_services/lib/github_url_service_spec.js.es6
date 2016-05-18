'use strict';

describe('Github URL service', () => {
  let GithubUrlService;
  let ServerConfigurations;

  beforeEach(module('alephServices'));

  beforeEach(module($provide => {
    ServerConfigurations = {};
    ServerConfigurations.configurations = {
      github_owner: 'gitOwner',
      github_repo: 'gitRepo',
      github_ref: 'heads/branch'
    };
    $provide.constant('ServerConfigurations', ServerConfigurations);
  }));

  beforeEach(inject(_GithubUrlService_ => {
    GithubUrlService = _GithubUrlService_;
  }));

  describe('#isValid', () => {
    it('returns truthy when we have github configurations', () => {
      expect(GithubUrlService.isValid()).toBeTruthy();
    });
  });

  describe('#commits', () => {
    it('generates url to commit history page for query id', () => {
      expect(GithubUrlService.commits(123))
        .toEqual('https://github.com/gitOwner/gitRepo/commits/branch/query_123');
    });
  });

  describe('#commit', () => {
    it('generates url to the commit page associated with a query version', () => {
      expect(GithubUrlService.commit({commit_sha: 'blehblehbleh'}))
        .toEqual('https://github.com/gitOwner/gitRepo/commit/blehblehbleh');
    });
  });

  describe('#compare', () => {
    it('generates url to compare page for two versions', () => {
      expect(GithubUrlService.compare({commit_sha: 'aSha'}, {commit_sha: 'bSha'}))
        .toEqual('https://github.com/gitOwner/gitRepo/compare/aSha...bSha');
    });
  });
});
