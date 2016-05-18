!(angular => {
  'use strict';

  function AlertModelImports(AlertResource, StandardModel, PollService) {

    return class Alert extends StandardModel {

      constructor() {
        super(
          'alert',
          AlertResource,
          {
            email: '',
            query_title: '',
            target: NaN,
            comparator: '',
            status: '',
            description: ''
          },
          [
            'email',
            'comparator',
            'target',
            'description',
            'query_title'
          ]
         );
        this._pollItemKey = 'alertItem_' + new Date().getTime();
      }

      save() {
        if (this.item.status !== 'Paused') {
          this.item.status = 'Pending';
        }

        return super.save().then(this._pollItem.bind(this));
      }

      //private methods

      _pollItem(item) {
        PollService.unPoll(this._pollItemKey);
        PollService.poll(item, this._pollItemKey, () => item.status !== 'Pending');
        return item;
      }
    };
  }

  AlertModelImports.$inject = ['AlertResource', 'StandardModel', 'PollService'];
  angular.module('alephServices.alert', []).service('Alert', AlertModelImports);
}(angular));
