!(angular => {
  'use strict';

  class AlertFlash {
    constructor($rootScope) {
      this._$rootScope = $rootScope;
      this.emitSuccess = _.partial(this.emit, 'success');
      this.emitInfo = _.partial(this.emit, 'info');
      this.emitWarning = _.partial(this.emit, 'warning');
      this.emitDanger = _.partial(this.emit, 'danger');
    }

    emit(type, message, schedule) {
      this._$rootScope.$broadcast(schedule ? 'scheduleAlert' : 'setAlert', {
        type: type,
        message: message
      });
    }

    // use this if you need to surface raw error to user
    emitError(message, error) {
      let e =  ' => ' + (_.exists(error) ? error : '');
      this.emitDanger(message + e);
    }
  }

  AlertFlash.$inject = ['$rootScope'];
  angular.module('alephServices.alertFlash', []).service('AlertFlash', AlertFlash);

}(angular));
