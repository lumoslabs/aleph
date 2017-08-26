!(angular => {
  'use strict';

  angular
    .module('alephServices', [
      'ngResource',

      // query & query version
      'alephServices.queryRequestTransformers',
      'alephServices.queryResource',
      'alephServices.queryHandler',
      'alephServices.queryVersions',
      'alephServices.queryTab',
      'alephServices.query',
      'alephServices.queryLoader',

      // visualzations
      'alephServices.visualizationService',
      'alephServices.visualization',
      'alephServices.visualizations',
      'alephServices.sourceRenderer',

      // results
      'alephServices.results',
      'alephServices.result',
      'alephServices.resultRunner',
      'alephServices.resultPoller',

      // alerts
      'alephServices.alertResource',
      'alephServices.alert',

      //snippets
      'alephServices.aceSnippetManager',

      //model framework
      'models',
      'modelGeneration',

      // schema
      'alephServices.schema.columns',
      'alephServices.schema.columnResource',
      'alephServices.schema.column',
      'alephServices.schema.commentResource',

      // roles
      'alephServices.roleModel',

      // general
      'alephServices.schemaCompleter',
      'alephServices.alertFlash',
      'alephServices.pageTitleManager',
      'alephServices.navigationGuard',
      'alephServices.aceCompleters',
      'alephServices.selectionTagInput',
      'alephServices.paginationComponents',
      'alephServices.pagination',
      'alephServices.openReplService',
      'alephServices.matcherRunner',
      'alephServices.actionHandler',
      'alephServices.aceSqlParse',
      'alephServices.pollService',
      'alephServices.lockService',
      'alephServices.localResource',
      'alephServices.githubUrlService',
      'alephServices.defaultAceConfigurator',
      'alephServices.parameterMethods',
      'alephServices.tagResource',
      'alephServices.keywordCompleter',
      'alephServices.spinnerState',
      'alephServices.serverConfigurations'
    ])

    .constant('defaultDateFormat', 'yyyy-MM-dd')
    .constant('ApplicationTitle', 'Aleph')

    /* N.B below is not a comprehensive list of all the models we use.
       These are auto generated standard models */
    .constant('ModelDefinitions', {
      result: {
        newItem: {
          sample_data: [],
          row_count: 0,
          parameters: [],
          headers: []
        },
        resource: {
          path: '/results/:id.json',
          parameters: {id: '@id'},
          actions: {
            index: {
              method: 'GET',
              isArray: true,
              url: '/queries/:query_id/query_versions/:query_version_id/results.json'
            }
          }
        }
      },

      snippet: {
        newItem: { name: '', content: '' },
        resource: {
          path: '/snippets/:id.json',
          parameters: {id: '@id'}
        }
      },

      runningResult: {
        newItem: {
          query_title: '',
          query_body: '',
          created_at: '',
          owner: '',
          owner_role: '',
          query_id: 0,
          query_version_id 0,
          version: 0
        },
        resource: {
          path: '/running_result/:id.json',
          parameters: {id: '@id'}
        }
      },

      visualization: {
        newItem: {
          html_source: '',
          title: ''
        },
        resource: {
          path: '/visualizations/:id.json',
          parameters: {id: '@id'},
          actions: {
            index: {
              method: 'GET',
              isArray: true,
              url: '/queries/:query_id/query_versions/:query_version_id/visualizations.json'
            }
          }
        }
      }
    })

    .service('getResultCsv', ['$http', '$window', ($http, $window) => {
      return function getResultCsv(resultId, failureMessage = 'The CSV file for this result was not found.') {
        $http.get('/result_csvs/' + resultId + '.json')
          .success(data => {
            $window.open(data.url, '_self', '');
            return data;
          })
          .error(() => {
            $window.alert(failureMessage);
          });
      };
    }]);

}(angular));
