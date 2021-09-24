"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _testEnvironment = require("../../../build/testing/testEnvironment");

var _testResults = require("../testResults");

const createViewResult = (contextName, testData, viewName, params) => {
  if (Array.isArray(testData) && testData.length) {
    let context = (0, _testEnvironment.getTestContext)(contextName).context;

    if (context.views && context.views[viewName] && context.views[viewName].map) {
      testData.forEach(doc => {
        context.views[viewName].map(doc);
      });
      let result = (0, _testResults.emitted)(contextName);

      if (context.views[viewName].reduce) {}

      return result;
    } else {
      throw new Error(`Missing view ${context.id}.views.${viewName}!`);
    }
  } else {
    throw new Error('createTestContext second parameter must be an array of document object to represent the data of testing database for view testing!');
  }
};

var _default = createViewResult;
exports.default = _default;