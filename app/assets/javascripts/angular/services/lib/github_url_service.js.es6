!(angular => {
  'use strict';

  class GithubUrlService {
    constructor(ServerConfigurations) {
      this._isValid = _.exists(ServerConfigurations.configurations.github_owner)
        && _.exists(ServerConfigurations.configurations.github_repo)
        && _.exists(ServerConfigurations.configurations.github_ref);

      if (this._isValid) {
        this._branch = ServerConfigurations.configurations.github_ref.split('/')[1];
        this._githubRoot = [
          'https://github.com',
          ServerConfigurations.configurations.github_owner,
          ServerConfigurations.configurations.github_repo
        ].join('/');
      }
    }

    commits(queryId) {
      return [
        this._githubRoot,
        'commits',
        this._branch,
        'query_' + queryId
      ].join('/');
    }

    commit(version) {
      return [
        this._githubRoot,
        'commit',
        version.commit_sha
      ].join('/');
    }

    compare(base, compare) {
      return [
        this._githubRoot,
        'compare',
        base.commit_sha + '...' + compare.commit_sha
      ].join('/');
    }

    isValid() {
      return this._isValid;
    }

  }

  GithubUrlService.$inject = ['ServerConfigurations'];
  angular.module('alephServices.githubUrlService', []).service('GithubUrlService', GithubUrlService);
}(angular));
