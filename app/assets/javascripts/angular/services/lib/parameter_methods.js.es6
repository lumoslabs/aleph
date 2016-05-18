!(angular => {
  'use strict';

  class ParameterMethods {

    constructor() {
      this._parameterRegex = () => /\{\s*([^{}]+?)\s*}/g;
    }

    constructParameter(parameterName) {
      return { name: parameterName, type: 'raw' };
    }

    detectParameters(body, parameters) {
      let _this = this;
      let matches = body.match(this._parameterRegex());
      if (_.exists(matches)) {
        matches.forEach(match => {
          let parameterName = _this._parameterRegex().exec(match)[1];
          if(_this._parameterExists(parameters, parameterName)) {
            parameters.push(_this.constructParameter(parameterName));
          }
        });
      }
    }

    // private methods

    _parameterExists(parameters, parameterName) {
      return _.findIndex(parameters, p => p.name === parameterName) === -1;
    }
  }

  angular.module('alephServices.parameterMethods', []).service('ParameterMethods', ParameterMethods);
}(angular));
