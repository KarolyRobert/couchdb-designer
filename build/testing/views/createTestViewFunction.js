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

const createTestViewFunction = (contextName, viewName, context) => {
  return opts => {
    let {
      database
    } = (0, _testEnvironment.getTestContext)(contextName);

    if (context.views[viewName].map) {
      let options = (0, _viewUtils.validateViewOptions)(Boolean(context.views[viewName].reduce), opts);
      let viewResult;

      if (database) {
        database.forEach(doc => context.views[viewName].map(doc));
        viewResult = (0, _testBuiltIns.emitted)(contextName);
      } else {
        throw 'For map/reduce testing you need to provide a testDatabase in createTestContext second parameter.';
      }

      if (options.reduce) {
        return (0, _reduceView.default)(viewResult, options, contextName, viewName);
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