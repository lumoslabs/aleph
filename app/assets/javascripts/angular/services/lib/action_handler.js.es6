!(angular => {
  'use strict';

  function ActionHandlerImports(AlertFlash, SpinnerState, $q) {

    return class ActionHandler {

      constructor(modelName, options = {}) {
        let noop = () => undefined;
        this._modelName = modelName;
        this._modelItem = options.modelItem || noop;
        this._modelCollection = options.modelCollection || noop;

        this.wrapFetch = _.partial(this.wrapAction, 'fetching');
        this.wrapUpdate = _.partial(this.wrapAction, 'updating');
        this.wrapCreate = _.partial(this.wrapAction, 'creating');
        this.wrapDestroy = _.partial(this.wrapAction, 'deleting');

        // handlers for collection models
        this.wrapInitCollection = _.partial(this.wrapAction, 'loading');
        this.wrapCollectionSave = _.partial(this.wrapAction, 'saving');
      }

      wrapAction(actionName, f) {
        let spinner = SpinnerState.withContext(this._modelName + '.' + actionName);
        spinner.on();
        return f()
          .then(this.onSuccess.bind(this, actionName))
          .catch(this.onError.bind(this, actionName))
          .finally(spinner.off.bind(spinner));
      }

      // protected methods

      onError(action, e) {
        AlertFlash.emitDanger(this._msg('Failed', action));
        return $q.reject(e);
      }

      onSuccess(action, o) {
        // TODO: implement something sweet if we only had like a status bar or something
        return o;
      }

      // private

      _msg(status, action) {
        return status + ' ' + action + ' ' + this._modelName + this._itemSuffix();
      }

      _itemSuffix() {
        let item = this._modelItem();
        let collection = this._modelCollection();

        let suffix = '';
        if(_.exists(item)) {
          if(_.exists(item.title) && item.title.length !== 0) {
            suffix = ', title = ' + item.title;
          } else if (_.exists(item.id) && item.id > 0) {
            suffix = ', id = ' + item.id;
          }
        } else if(_.exists(collection)) {
          suffix = ', count = ' + collection.length;
        }
        return suffix;
      }
    };
  }

  ActionHandlerImports.$inject = ['AlertFlash', 'SpinnerState', '$q'];
  angular.module('alephServices.actionHandler', []).service('ActionHandler', ActionHandlerImports);

}(angular));
