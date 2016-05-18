;(function (window) {
  var angular = window.angular;

  /** TEMPLATE /template/treasure-overlay-spinner/treasure-overlay-spinner.html
   *  <div class="treasure-overlay-spinner-content">
   *    <div class="treasure-overlay-spinner-container">
   *      <div class="treasure-overlay-spinner"></div>
   *    </div>
   *    <ng-transclude></ng-transclude>
   *  </div>
   */

  // constants
  var TEMPLATE_PATH = '/template/treasure-overlay-spinner/treasure-overlay-spinner.html';
  var TEMPLATE = '';
  TEMPLATE += '<div class="treasure-overlay-spinner-content">';
  TEMPLATE +=   '<div class="treasure-overlay-spinner-container">';
  TEMPLATE +=     '<div class="treasure-overlay-spinner"></div>';
  TEMPLATE +=   '</div>';
  TEMPLATE +=   '<ng-transclude></ng-transclude>';
  TEMPLATE += '</div>';

  // module
  angular.module('treasure-overlay-spinner', ['ngAnimate']);

  // directive
  angular.module('treasure-overlay-spinner').directive('treasureOverlaySpinner', overlaySpinner);
  overlaySpinner.$inject = ['$animate'];
  function overlaySpinner ($animate) {
    return {
      templateUrl: TEMPLATE_PATH,
      scope: {active: '='},
      transclude: true,
      restrict: 'E',
      link: link
    };

    function link (scope, iElement) {
      scope.$watch('active', statusWatcher);
      function statusWatcher (active) {
        $animate[active ? 'addClass' : 'removeClass'](iElement, 'treasure-overlay-spinner-active');
      }
    }
  }

  // template
  angular.module('treasure-overlay-spinner').run(overlaySpinnerTemplate);
  overlaySpinnerTemplate.$inject = ['$templateCache'];
  function overlaySpinnerTemplate ($templateCache) {
    $templateCache.put(TEMPLATE_PATH, TEMPLATE);
  }

}.call(this, window));
