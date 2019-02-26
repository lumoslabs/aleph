 !(angular => {
  'use strict';

  angular
    .module('alephControllers', [
      'alephControllers.schemaIndexController',
      'alephControllers.queryIndexController',
      'alephControllers.queryShowController',
      'alephControllers.queryReplController',
      'alephControllers.alertIndexController',
      'alephControllers.alertShowController',
      'alephControllers.runningResultIndexController',
      'alephControllers.snippetIndexController',
      'alephControllers.singleResultShowController',
      'alephServices',
      'ui.ace',
      'ngRoute',
      'ui.bootstrap.alert'
    ])

    .controller('BodyController', ['$scope', 'SpinnerState', 'ServerConfigurations',
      function NavBarController($scope, SpinnerState, ServerConfigurations) {
        $scope.SpinnerState = SpinnerState;
        $scope.ServerConfigurations = ServerConfigurations;
      }
    ])

    .controller('NavBarController', ['$scope', '$window', '$location',
      function NavBarController($scope, $window, $location) {

        $scope.pathIncludes = function pathIncludes(string) {
          return ($location.path().indexOf(string) > -1);
        };

        $scope.signOut = function signOut() {
          $window.location.href = '/sign_out';
        };
      }
    ])

    .controller('AlertBarController', ['$scope', '$rootScope',
      function ($scope, $rootScope) {
        $scope.alerts = [];

        function addAlert(alert) {
          var latest = _.last($scope.alerts);
          if ($scope.alerts.length == 0 || latest.message != alert.message || latest.type != alert.type) {
            $scope.alerts.push(alert);
          }
        }

        $scope.dismiss = function dismiss() {
          $scope.alerts.length = 0;
        };

        $rootScope.$on('$routeChangeSuccess', () => {
          if ($scope.scheduledAlert) {
            addAlert($scope.scheduledAlert);
            $scope.scheduledAlert = null;
          } else {
            $scope.dismiss();
          }
        });

        $rootScope.$on('scheduleAlert', (event, alert) => {
          $scope.scheduledAlert = alert;
        });

        $rootScope.$on('setAlert', (event, alert) => {
          addAlert(alert);
        });
      }
    ]);
}(angular));
