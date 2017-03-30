!(angular => {
  'use strict';

  class QueryReplController {
    constructor($uibModalInstance, getResultCsv, DefaultAceConfigurator, ResultRunner, Query,
      Results, NavigationGuard, KeyBindings, hotkeys, options, $scope) {
        this._initQuery(options, Query);
        this._modalInstance = $uibModalInstance;
        this.results = new Results();
        this.resultRunner = new ResultRunner(this.query, this.results, {
          sandbox: true,
          enablePolling: true
        });
        this._queryBodyState = this._queryBody();
        this._getResultCsv = getResultCsv;

        /* FIXME: need to think what to do about keybindings and navigation guard and unpolling
           in a scopeless angular 2.0 world */
        $scope.$on('$destroy', () => {
          _.each(this.results.collection, result => {
            result.poller.unPoll();
          });
        });

        this._initKeyBindings(KeyBindings, hotkeys, $scope);

        this._navigationGuard = new NavigationGuard($scope)
          .registerLocationChangeStart(NavigationGuard.defaultPreventer())
          .registerOnBeforeUnload(() => {
            if(this._queryBodyState !== this._queryBody() && !this.downloadFlag) {
              return 'Query has unsaved changes!';
            }
            this.downloadFlag = false;
          });

        /* FIXME: work-around for the fact that ace-ui un-binds aceLoaded and destroy the `this`
           there isn't a way to bind the function in the angular expression in ace-ui either */
        let keysForAce = {
          save: this._saveKb,
          detectParameters: this._detectParametersKb,
          run: this._runKb,
          triggerAutoComplete: this._triggerAutoComplete
        };

        this.aceLoaded = function aceLoaded(editor) {
          new DefaultAceConfigurator(editor).snippetsConfig();
          editor.focus();
          editor.commands.addCommand(keysForAce.save.aceKeyCmd);
          editor.commands.addCommand(keysForAce.detectParameters.aceKeyCmd);
          editor.commands.bindKey(keysForAce.run.bindKey, keysForAce.run.keyFn);
          editor.commands.bindKey(keysForAce.triggerAutoComplete.bindKey, keysForAce.triggerAutoComplete.keyFn);
          editor.setOptions({
            maxLines: 500,
            minLines: 2
          });
        };

    }

    runQuery() {
      this.resultRunner.run();
    }

    validToRun() {
      let result = this.results.collection[0];
      return !result || result.item.status === 'complete' || result.item.status === 'failed';
    }

    validToSave() {
      return this.query.item.title !== '';
    }

    saveToolTipText() {
      return (this.query.item.title === '') ? 'Please enter a query title' : '';
    }

    save() {
      // need to explicity disable navigationGuard since it sometimes takes angular too long to destroy the scope
      this._navigationGuard.disable();
      this._setParameterDefaultValues(this.query.item.version.parameters, this.resultRunner.substitutionValues);
      let result = this.results.collection[0];
      if(this._options.skipSave) {
        /* FIXME: this is for alerts where we want to pop up the repl and save later
           We probably have to rethink the alerts UI/UX to take this hack out */
        this._toModelAndClose(angular.copy(this.query.item));
      } else {
        this.query.save(_.exists(result) ? { result_id: result.item.id } : {})
          .then(this._toModelAndClose.bind(this))
          .catch(err => {
            console.error('query save failed', err);
            alert('Query save failed!');
          });
      }

    }

    exit() {
      // need to explicity disable navigationGuard since it sometimes takes angular too long to destroy the scope
      this._navigationGuard.disable();
      this._modalInstance.dismiss('QueryReplExit');
    }

    getCsv(resultId) {
      // need to get past onbeforeunload function in navigation guard when downloading
      this.downloadFlag = true;
      return this._getResultCsv(resultId);
    }

    // private methods

    _toModelAndClose(item) {
      let model = new this._Query();
      model.internalize(item);
      this._modalInstance.close(model);
    }

    _queryBody() {
      return this.query.item.version.body;
    }

    _setParameterDefaultValues(parameters, substitutionValues) {
      parameters.forEach(parameter => {
        let val = substitutionValues[parameter.name];
        if (_.exists(val)) {
          parameter.default = val;
        }
      });
    }

    _initQuery(options, Query) {
      this._Query = Query;
      this._options = options;
      this.query = new Query();
      if(_.exists(options.query)) {
        this.query.internalize(angular.copy(options.query.item));
      } else {
        this.query.initItem();
      }
    }

    _initKeyBindings(KeyBindings, hotkeys, $scope) {
      this._saveKb = KeyBindings.saveQuery.withKeyFn(() => {
        if(this.validToSave()) {
          this.save();
        }
      });

      this._triggerAutoComplete = KeyBindings.triggerAutoComplete.withKeyFn((editor) => {
        editor.insert('.');
        editor.execCommand("startAutocomplete");
      });

      this._runKb = KeyBindings.runQuery.withKeyFn(() => {
        if(this.validToRun()) {
          this.runQuery();
        }
      });

      this._detectParametersKb = KeyBindings.detectParameters.withKeyFn(() => {
        this.query.detectParameters();
        $scope.$digest();
      });

      hotkeys.bindTo($scope)
        .add(this._saveKb.hotKey)
        .add(this._runKb.hotKey)
        .add(this._triggerAutoComplete.hotKey)
        .add(this._detectParametersKb.hotKey);
    }
  }

  QueryReplController.$inject = ['$uibModalInstance', 'getResultCsv', 'DefaultAceConfigurator', 'ResultRunner',
    'Query', 'Results', 'NavigationGuard', 'KeyBindings', 'hotkeys', 'options', '$scope'];

  angular
    .module('alephControllers.queryReplController', ['alephServices'])
    .controller('QueryReplController', QueryReplController);

}(angular));
