!(angular => {
  'use strict';

  class AlertIndexController {
    constructor(AlertResource, PaginationComponents, Alert, defaultDateFormat) {
      this.pagination = new PaginationComponents('Paginated Queries', AlertResource.index, Alert);
      this.defaultDateFormat = defaultDateFormat;
    }
  }

  AlertIndexController.$inject = ['AlertResource', 'PaginationComponents', 'Alert', 'defaultDateFormat'];

  angular
    .module('alephControllers.alertIndexController', ['alephServices'])
    .controller('AlertIndexController', AlertIndexController);
}(angular));
