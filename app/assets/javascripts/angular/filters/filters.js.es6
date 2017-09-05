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
      return (originalSeconds) => {
        let SECONDS_IN_HOUR = 3600;
        let SECONDS_IN_MINUTE = 60;

        let hours = Math.floor(originalSeconds / SECONDS_IN_HOUR);
        let minutes = Math.floor((originalSeconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
        let seconds = Math.round(originalSeconds % SECONDS_IN_MINUTE);

        return ((originalSeconds > SECONDS_IN_HOUR) ? hours + ' hours ' : '') +
               ((originalSeconds > SECONDS_IN_MINUTE) ? minutes + ' minutes ' : '') +
               seconds + ' seconds';
      };
    })

    .filter('runtimeDuration', () => {
      return (originalSeconds) => {
        let SECONDS_IN_DAY = 86400;
        let SECONDS_IN_HOUR = 3600;
        let SECONDS_IN_MINUTE = 60;

        let days = Math.floor(originalSeconds / SECONDS_IN_DAY);
        let hours = Math.floor((originalSeconds % SECONDS_IN_DAY) / SECONDS_IN_HOUR);
        let minutes = Math.floor((originalSeconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
        let seconds = Math.round(originalSeconds % SECONDS_IN_MINUTE);

        return ((originalSeconds > SECONDS_IN_DAY) ? days + ' days ' : '') +
               ((originalSeconds > SECONDS_IN_HOUR) ? hours + ':' : '00:') +
               ((originalSeconds > SECONDS_IN_MINUTE) ? minutes + ':' : '00:') +
               seconds;
      };
    });
}(angular));
