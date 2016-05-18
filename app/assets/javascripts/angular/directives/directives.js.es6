!(angular => {
  'use strict';

  angular
    .module('alephDirectives', [
      'alephDirectives.visualization',
      'alephDirectives.result',
      'alephDirectives.results',
      'alephDirectives.queryVersionSidebar',
      'alephDirectives.queryDetails'
    ])

    .directive('ngConfirmClick', [() => {
        return {
          priority: -1,
          restrict: 'A',
          link: function(scope, element, attrs){
            element.bind('click', e => {
              let message = attrs.ngConfirmClick;
              if(message && !confirm(message)){
                e.stopImmediatePropagation();
                e.preventDefault();
              }
            });
          }
        };
      }
    ]);

}(angular));
