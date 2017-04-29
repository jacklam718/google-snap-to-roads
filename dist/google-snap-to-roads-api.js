'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchSnapPoints = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _queryStringify = require('./query-stringify');

var _queryStringify2 = _interopRequireDefault(_queryStringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MAX_POINTS_PER_REQUEST = 100;
var API_URL = 'https://roads.googleapis.com/v1/snapToRoads';
var API_KEY = 'GOOGLE_ROADS_ACCESS_TOKEN';

var fetchSnapPoints = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(params) {
    var qs;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            qs = (0, _queryStringify2.default)(params);
            _context.prev = 1;
            _context.next = 4;
            return fetch(API_URL + '?' + qs + '&key=' + API_KEY);

          case 4:
            _context.next = 6;
            return _context.sent.json();

          case 6:
            return _context.abrupt('return', _context.sent);

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](1);
            return _context.abrupt('return', _context.t0);

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[1, 9]]);
  }));

  return function fetchSnapPoints(_x) {
    return _ref.apply(this, arguments);
  };
}();

var snapToRoads = function snapToRoads(params) {
  var coordinates = params.path.split('|');

  if (coordinates.length <= MAX_POINTS_PER_REQUEST) {
    return fetchSnapPoints((0, _extends3.default)({}, params, { path: coordinates.join('|') }));
  }

  var snapToRoadsPromises = [];
  // 100 coordinates per segment
  var segmentedCoordinates = [];

  coordinates.forEach(function (coordinate) {
    segmentedCoordinates.push(coordinate);

    if (segmentedCoordinates.length >= MAX_POINTS_PER_REQUEST) {
      var path = segmentedCoordinates.join('|');
      segmentedCoordinates = [];
      snapToRoadsPromises.push(fetchSnapPoints((0, _extends3.default)({}, params, { path: path })));
    }
  });
  if (segmentedCoordinates.length !== 0) {
    var path = segmentedCoordinates.join('|');
    snapToRoadsPromises.push(fetchSnapPoints((0, _extends3.default)({}, params, { path: path })));
  }

  return _promise2.default.all(snapToRoadsPromises).then(function (results) {
    var allSnappedPoints = [];
    results.forEach(function (_ref2) {
      var snappedPoints = _ref2.snappedPoints;

      allSnappedPoints.push.apply(allSnappedPoints, (0, _toConsumableArray3.default)(snappedPoints));
    });
    return { snappedPoints: allSnappedPoints };
  });
};

exports.fetchSnapPoints = fetchSnapPoints;
exports.default = snapToRoads;