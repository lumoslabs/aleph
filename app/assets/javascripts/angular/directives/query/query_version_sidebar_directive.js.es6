!(angular => {
  'use strict';

  class QueryVersionSidebarController {
    constructor(GithubUrlService, $location) {
      this._gitUrl = GithubUrlService;
      this._$location = $location;
      this.selectedVersions = [];

      this.componentCallbacks.unshift(data => {
        let versionItems = _.map(data.queryVersions, qv => qv.item);
        this.currentVersion = _.findWhere(versionItems, { id: this.query.item.version.id });
        this.currentVersion.selected = true;
        this.currentVersionCommitUrl = this._gitUrl.commit(this.currentVersion);
        this.githubHistory = this._gitUrl.commits(this.query.item.id);
      });
    }

    get githubCommit() { return this._githubCommitUrl || this.currentVersionCommitUrl; }
    get githubCompare() { return this._githubCompareUrl; }

    figureGithubUrl() {
      if(this.selectedVersions.length === 2) {
        let sorted = _.sortBy(this.selectedVersions, 'id');      // ensure base is always earlier version
        this._githubCompareUrl = this._gitUrl.compare(sorted[0], sorted[1]);
      } else if(this.selectedVersions.length === 1) {
        this._githubCommitUrl = this._gitUrl.commit(this.selectedVersions[0]);
      }
    }

    queryIsPersistedAsScheduled() {
      return (this.query.isPristine() && this.query.item.scheduled_flag) || (this.query.isDirty() && !this.query.item.scheduled_flag);
    }

    alertResultLinkCopied() {
      this._alertFlash.emitSuccess('S3 URL copied to clipboard!');
    }

    loadQueryByVersion(queryVersionId) {
      this._$location.path('/queries/' + this.query.item.id + '/query_versions/' + queryVersionId);
    }

    hasComment(queryVersion) {
      return Utils.stringHelpers.isPresent(queryVersion.comment);
    }

    githubIsEnabled() {
      return this._gitUrl.isValid();
    }
  }

  QueryVersionSidebarController.$inject = ['GithubUrlService', '$location'];

  function queryVersionSidebarComponent() {
    return {
      restrict: 'E',
      scope: {
        'query': '=',
        'versions': '=',
        'componentCallbacks': '='
      },
      templateUrl: 'query-version-sidebar',
      controller: 'QueryVersionSidebarController',
      controllerAs: 'qvSidebarCtrl',
      bindToController: true
    };
  }

  angular
    .module('alephDirectives.queryVersionSidebar', ['alephServices'])
    .controller('QueryVersionSidebarController', QueryVersionSidebarController)
    .directive('queryVersionSidebar', queryVersionSidebarComponent);
}(angular));
