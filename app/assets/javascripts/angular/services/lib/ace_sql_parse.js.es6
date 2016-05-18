!(angular => {
  'use strict';

  function AceSqlParse(session, cursorPos) {
    let Search = ace.require('ace/search').Search;
    let search = new Search();
    let Range = ace.require('ace/range').Range;
    let previousOccurances = [];
    let nextOccurances = [];
    let locationsInitialized = false;
    let relevantFromBoundariesForClause = {
      select: {
        start: {
          location: nextOccurances,
          type: 'from'
        },
        end: {
          location: nextOccurances,
          type: 'where'
        }
      },
      from: {
        start: {
          location: previousOccurances,
          type: 'from'
        },
        end: {
          location: nextOccurances,
          type: 'where'
        }
      },
      where: {
        start: {
          location: previousOccurances,
          type: 'from'
        },
        end: {
          location: previousOccurances,
          type: 'where'
        }
      }
    };
    let currentClause;

    function previousOccurance(word) {
      search.set({needle: word, start: cursorPos, wholeWord: true, backwards: true,  wrap: false});
      return findResult(word);
    }

    function nextOccurance(word) {
      search.set({needle: word, start: cursorPos, wholeWord: true, backwards: false, wrap: false});
      return findResult(word);
    }

    function findResult(word) {
      let result = search.find(session);
      if (_.exists(result)) {
        return _.merge(result, {type: word});
      }
    }

    function sortPositions(positionObjects) {
      return positionObjects.sort(function (a, b) {
        let aRow = a.start.row;
        let bRow = b.start.row;
        let aColumn = a.start.column;
        let bColumn = b.start.column;

        if (aRow === bRow) {
          return (aColumn < bColumn) ? -1 : (aColumn > bColumn) ? 1 : 0;
        } else {
          return (aRow < bRow) ? -1 : 1;
        }
      });
    }

    function initLocations() {
      _.each(['select', 'from', 'where'], function(clause) {
        previousOccurances.push(previousOccurance(clause));
        nextOccurances.push(nextOccurance(clause));
      });

      previousOccurances = _.compact(previousOccurances);
      nextOccurances = _.compact(nextOccurances);
      locationsInitialized = true;
    }

    function parseCurrentClause() {
      if (locationsInitialized === false) { initLocations(); }
      if (previousOccurances.length === 0) { return false; }

      let locationsWithCursor = _.union(previousOccurances, [{start: cursorPos, type: 'cursor'}]);

      let sorted = sortPositions(locationsWithCursor);
      let cursorIndex = _.findIndex(sorted, {type: 'cursor'});
      let recentObject = sorted[cursorIndex - 1];

      currentClause = recentObject.type;
      return currentClause;
    }

    function parseFromClause() {
      if (locationsInitialized === false) { initLocations(); }
      if (!_.exists(currentClause)) { parseCurrentClause(); }

      let rangeStartWord,
        rangeEndWord,
        fromLocation = relevantFromBoundariesForClause[currentClause];

      if (_.exists(fromLocation)) {
        rangeStartWord = _.findWhere(fromLocation.start.location, {type: fromLocation.start.type});
        rangeEndWord = _.findWhere(fromLocation.end.location, {type: fromLocation.end.type}) ||
          _.findWhere(nextOccurances, {type: 'select'});
      }

      if (!_.exists(rangeStartWord)) {
        rangeStartWord = defaultFromRangeStart();
      }

      if (!_.exists(rangeEndWord)) {
        rangeEndWord = defaultFromRangeEnd();
      }

      let range = new Range(rangeStartWord.end.row, rangeStartWord.end.column,
        rangeEndWord.start.row, rangeEndWord.start.column);
      return session.getTextRange(range);
    }

    function defaultFromRangeStart() {
      return {
        end: {
          row: 0,
          column: 0
        }
      };
    }

    function defaultFromRangeEnd() {
      let aceDocument = session.getDocument();
      let rows = aceDocument.getLength();
      let lastLine = aceDocument.getLine(rows - 1);
      let width = lastLine.length;

      return {
        start: {
          row: rows,
          column: width
        }
      };
    }

    return {currentClause: parseCurrentClause(), fromClause: parseFromClause()};
  }

  angular.module('alephServices.aceSqlParse', []).service('aceSqlParse', () => AceSqlParse);
}(angular));
