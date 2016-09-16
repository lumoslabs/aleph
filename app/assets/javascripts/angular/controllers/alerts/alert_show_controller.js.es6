!(angular => {
  'use strict';

  class AlertShowController {

    constructor($scope, DefaultAceConfigurator, Query, Alert, OpenReplService, NavigationGuard, $routeParams,
      $location) {
      this._openReplService = OpenReplService;
      this._$location = $location;

      this.aceLoaded = function aceLoaded(editor) {
        new DefaultAceConfigurator(editor).readOnlyConfig();
      };

      this.alert = new Alert();
      this.query = new Query();

      /* initialize models from route params */
      if ($routeParams.alertId === 'new') {
        this.alert.initItem()
          .then(this.query.initItem.bind(this.query, null))
          .then(this._openReplService.open.bind(this._openReplService, { skipSave: true }))
          .then(query => {
            this.query = query;
            this.alert.item.query_title = query.item.title;
            this.query.item.tags.push('alert-query');
          })
      } else {
        this.alert.initItem($routeParams.alertId)
          .then(alert => this.query.initItem(alert.query_id, 'latest'))
      }

      /* FIXME: need to think what to do about navigation guard in a scopeless angular 2.0 world */
      this._navigationGuard = new NavigationGuard($scope)
        .registerLocationChangeStart(event => {
          if(this.alert.isDirty()) {
            let answer = confirm('Your alert has not been saved. Are you sure you want to leave this page?');
            if (!answer) {
              event.preventDefault();
            }
          }
        }).registerOnBeforeUnload(() => {
          if(this.alert.isDirty()) {
            return 'Alert has unsaved changes!';
          }
        });
    }

    togglePaused() {
      if (this.alert.item.status === 'Paused') {
        this.alert.item.status = 'Pending';
      } else {
        this.alert.item.status = 'Paused';
      }

      this.alert.save();
    }

    editAlert() {
      this._openReplService.open({
        query: this.query
      }).then(query => {
        this.query = query;
        return this.query.save();
      }).then(this.alert.save.bind(this.alert));
    }

    deleteAlert() {
      this.alert.destroy().then(() => this._$location.path('/alerts'));
    }

    saveAlert() {
      let _this = this;
      if(!this.isPersisted()) {
        // need to save query AND save alert enriched w/ the query id when creating a brand new alert
        this.query.save().then(query => {
          _this.alert.item.query_id = query.id;
          _this.alert.save();
        });
      } else {
        this.alert.save();
      }
    }

    // private methods

    isPersisted() {
      return this.alert.isPersisted() && this.query.isPersisted();
    }
  }

  AlertShowController.$inject = ['$scope', 'DefaultAceConfigurator', 'Query', 'Alert', 'OpenReplService',
    'NavigationGuard', '$routeParams', '$location'];

  angular
    .module('alephControllers.alertShowController', ['alephServices'])
    .controller('AlertShowController', AlertShowController);

}(angular));
