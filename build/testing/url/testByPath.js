"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createViewResult = _interopRequireDefault(require("./createViewResult"));

var _testResults = require("../testResults");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const testByPath = (contextName, testDatabase, url) => {
  let query = new URL(`http://${url}`);

  switch (query.host) {
    case '_view':
      return (0, _createViewResult.default)(contextName, testDatabase, query.pathname.substr(1), query.searchParams);

    case '_all_docs':
      return testDatabase;

    case 'logged':
      return (0, _testResults.logged)(contextName);

    case 'emitted':
      return (0, _testResults.emitted)(contextName);

    default:
      throw new Error(`The ${query.host} url is not supported yet! Please write an issue if you need this type of testing.`);
  }
};

var _default = testByPath;
exports.default = _default;