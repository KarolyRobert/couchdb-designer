"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _testEnvironment = require("../../build/testing/testEnvironment");

var _testResults = require("./testResults");

var _viewUtils = require("./viewUtils");

const createTestViewFunction = (contextName, viewName) => {
  return opts => {
    let {
      context,
      database
    } = (0, _testEnvironment.getTestContext)(contextName);

    if (context.views[viewName].map) {
      let options = (0, _viewUtils.validateViewOptions)(Boolean(context.views[viewName].reduce), opts);
      let viewResult;

      if (database) {
        database.forEach(doc => context.views[viewName].map(doc));
        viewResult = (0, _testResults.emitted)(contextName);
      } else {
        throw 'For map/reduce testing you need to provide a testDatabase in createTestContext second parameter.';
      }

      if (options.reduce) {
        if (options.group && options.group_level > 0) {
          let groups = groupViewResult(viewResult.rows, options.group_level);
        } else {}
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