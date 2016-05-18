'use strict';

describe('Query Version Sidebar Controller', () => {
  let QueryVersionSidebarController;
  let GithubUrlService;
  let $location;
  let componentCallbacks;
  let query;
  let digest;

  beforeEach(module('alephDirectives'));

  beforeEach(inject(($controller, _$location_, $q, $rootScope) => {
    digest = () => { $rootScope.$digest(); };

    $location = _$location_;
    spyOn($location, 'path');

    GithubUrlService = {
      compare: jasmine.createSpy('GithubUrlService.compare'),
      commits: jasmine.createSpy('GithubUrlService.commits'),
      commit: jasmine.createSpy('GithubUrlService.commit'),
      isValid: jasmine.createSpy('GithubUrlService.isValid'),
    };

    componentCallbacks = [];
    query = {
      item: {
        id: 6,
        version: {
          id: 666
        }
      }
    };
    QueryVersionSidebarController = $controller('QueryVersionSidebarController',
      {
        GithubUrlService: GithubUrlService
      },
      {
        componentCallbacks: componentCallbacks,
        query: query
      });
  }));

  describe('on construction', () => {
    it('registers a query load callback', () => {
      expect(componentCallbacks.length).toEqual(1);
    });
  });

  describe('query load callback', () => {
    let data;
    let callback;
    beforeEach(() => {
      data = {
        queryVersions: [
          { item: { id: 555 } },
          { item: { id: 666 } },
          { item: { id: 777 } }
        ]
      };
      callback = componentCallbacks[0];
      callback(data);
    });

    it('finds and sets the current version based off the version id in the query object', () => {
      expect(QueryVersionSidebarController.currentVersion.id).toEqual(666);
    });

    it('selects the current version', () => {
      expect(QueryVersionSidebarController.currentVersion.selected).toBe(true);
    });

    it('figure and set the github commit url of the current version', () => {
      expect(GithubUrlService.commit).toHaveBeenCalledWith(QueryVersionSidebarController.currentVersion);
    });

    it('figure and set the github history url', () => {
      expect(GithubUrlService.commits).toHaveBeenCalledWith(query.item.id);
    });
  });

  describe('when one version is selected', () => {
    let version;
    beforeEach(() => {
      version = { id: 123 };

      QueryVersionSidebarController.selectedVersions = [version];
      QueryVersionSidebarController.figureGithubUrl();
    });

    it('calls githubUrlService.commit with the selected version', () => {
      expect(GithubUrlService.commit).toHaveBeenCalledWith(version);
    });
  });

  describe('when two versions are selected', () => {
    let versionA;
    let versionB;
    beforeEach(() => {
      versionA = { id: 123 };
      versionB = { id: 888 };

      QueryVersionSidebarController.selectedVersions = [versionB, versionA];
      QueryVersionSidebarController.figureGithubUrl();
    });

    it('calls githubUrlService.compare with the selected versions and with the proper base and compare', () => {
      expect(GithubUrlService.compare).toHaveBeenCalledWith(versionA, versionB);
    });
  });

  describe('#loadQueryByVersion', () => {
    beforeEach(() => {
      QueryVersionSidebarController.loadQueryByVersion(999);
    });

    it('navigates to the correct query version', () => {
      expect($location.path).toHaveBeenCalledWith('/queries/6/query_versions/999');
    });
  });

  describe('#githubIsEnabled', () => {
    beforeEach(() => {
      QueryVersionSidebarController.githubIsEnabled();
    });

    it('delegates to GithubUrlService.isValid', () => {
      expect(GithubUrlService.isValid).toHaveBeenCalled();
    });
  });
});
