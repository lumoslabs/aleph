!(angular => {
  'use strict';

  angular
    .module('alephFilters', [])
    .filter('objectDotKeys', () => {
      // this is literally only needed because of https://github.com/angular/angular.js/issues/6210
      return input => {
        return Object.keys(input);
      };
    })

    .filter('humanReadableDuration', () => {
      return (original_seconds) => {
        let SECONDS_IN_HOUR = 3600;
        let SECONDS_IN_MINUTE = 60;

        let hours = Math.floor(original_seconds / SECONDS_IN_HOUR);
        let minutes = Math.floor((original_seconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
        let seconds = Math.round(original_seconds % SECONDS_IN_MINUTE);

        return ((original_seconds > SECONDS_IN_HOUR) ? hours + ' hours ' : '') +
               ((original_seconds > SECONDS_IN_MINUTE) ? minutes + ' minutes ' : '') +
               seconds + ' seconds';
      };
    });
}(angular));
