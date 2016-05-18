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
      'alephControllers.snippetIndexController',
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

        $scope.dismiss = function dismiss() {
          $scope.alerts.length = 0;
        };

        $rootScope.$on('$routeChangeSuccess', () => {
          if ($scope.scheduledAlert) {
            $scope.alerts.push($scope.scheduledAlert);
            $scope.scheduledAlert = null;
          } else {
            $scope.dismiss();
          }
        });

        $rootScope.$on('scheduleAlert', (event, alert) => {
          $scope.scheduledAlert = alert;
        });

        $rootScope.$on('setAlert', (event, alert) => {
          $scope.alerts.push(alert);
        });
      }
    ]);
}(angular));
