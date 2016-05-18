!(angular => {
  'use strict';

  angular
    .module('aleph', [
      'alephControllers',
      'alephDirectives',
      'alephServices',
      'alephFilters',
      'ngAnimate',
      'ngClipboard',
      'ui.bootstrap',
      'infinite-scroll',
      'ngTagsInput',
      'cfp.hotkeys',
      'angular.filter',
      'selectionModel',
      'treasure-overlay-spinner'
    ])

    .run(['AceCompleters', AceCompleters => {
      AceCompleters.setCompleters();
    }])

    .run(['$rootScope', 'PageTitleManager', ($rootScope, PageTitleManager) => {
      $rootScope.pageTitleManager = PageTitleManager;
    }])

    .value('KeyBindings', {
      saveQuery: new KeyBinding('Save Query', {mac: 'command+shift+s', win:'ctrl+shift+s'}),
      runQuery: new KeyBinding('Run Query', {mac: 'command+shift+k', win:'ctrl+shift+k'}),
      detectParameters: new KeyBinding('Detect Parameters', {mac: 'command+shift+p', win:'ctrl+shift+p'})
    })

    .config(['$locationProvider', $locationProvider => {
      $locationProvider.html5Mode(true);
    }])

    .config(['$animateProvider', $animateProvider => {
      $animateProvider.classNameFilter(/ng-animate-enabled/);
    }])

    .config(['$routeProvider', $routeProvider => {
      $routeProvider
        .when('/queries/:query_id', {
          redirectTo: '/queries/:query_id/query_versions/latest'
        })
        .when('/queries', {
          templateUrl: 'queryIndex',
          controller: 'QueryIndexController',
          controllerAs: 'queryIdxCtrl',
          reloadOnSearch: false
        })
        .when('/schemas/:schemaName', {
          templateUrl: 'schemaShow',
          controller: 'SchemaShowController'
        })
        .when('/schemas', {
          title: 'Schemas',
          templateUrl: 'schemaIndex',
          controller: 'SchemaIndexController',
          controllerAs: 'schemaIdxCtrl',
          reloadOnSearch: false
        })
        .when('/queries/:query_id/query_versions/:query_version_id', {
          templateUrl: 'showQuery',
          controller: 'QueryShowController',
          controllerAs: 'queryShowCtrl'
        })
        .when('/alerts', {
          title: 'Alerts',
          templateUrl: 'alertIndex',
          controller: 'AlertIndexController',
          controllerAs: 'alertIdxCtrl',
          reloadOnSearch: false
        })
        .when('/alerts/:alertId', {
          templateUrl: 'alertShow',
          controller: 'AlertShowController',
          controllerAs: 'alertShowCtrl'
        })
        .when('/snippets', {
          title: 'Snippets',
          templateUrl: 'snippetIndex',
          controller: 'SnippetIndexController',
          controllerAs: 'snippetIdxCtrl'
        })
        .otherwise('/queries');
    }]);
}(angular));
