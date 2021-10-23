"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _testEnvironment = require("../../build/testing/testEnvironment");

var _createMangoFind = _interopRequireDefault(require("./mango/createMangoFind"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createMangoFunctions = contextId => {
  let {
    server
  } = (0, _testEnvironment.getTestContext)(contextId);
  server['find'] = (0, _createMangoFind.default)(contextId);
};

var _default = createMangoFunctions;
exports.default = _default;