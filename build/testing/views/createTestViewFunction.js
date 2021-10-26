"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _testEnvironment = require("../../../build/testing/testEnvironment");

var _testBuiltIns = require("../testBuiltIns");

var _viewUtils = require("./viewUtils");

var _reduceView = _interopRequireDefault(require("./reducers/reduceView"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createTestViewFunction = (contextId, viewName, context) => {
  return (opts, partition) => {
    let {
      database
    } = (0, _testEnvironment.getTestContext)(contextId);

    if (context.views[viewName].map) {
      let options = (0, _viewUtils.validateViewOptions)(Boolean(context.views[viewName].reduce), opts);
      let viewResult;

      if (partition && context.options && context.options.partitioned || partition && !context.options) {
        database.data.filter(doc => {
          return partition === doc._id.split(':')[0];
        }).forEach(pdoc => context.views[viewName].map(pdoc));
      } else {
        if (partition) {
          throw {
            error: "query_parse_error",
            reason: "`partition` parameter is not supported in this design doc"
          };
        } else {
          if (context.options && context.options.partitioned || database.partitioned && !context.options) {
            throw {
              error: "query_parse_error",
              reason: "`partition` parameter is mandatory for queries to this view."
            };
          }

          database.data.forEach(doc => context.views[viewName].map(doc));
        }
      }

      viewResult = (0, _testBuiltIns.emitted)(contextId);

      if (options.reduce) {
        return (0, _reduceView.default)(viewResult, options, context, viewName);
      } else {
        return viewResult;
      }
    } else {
      throw `Missing map function in ${context.id}/views/${viewName}!`;
    }
  };
};

var _default = createTestViewFunction;
exports.default = _default;