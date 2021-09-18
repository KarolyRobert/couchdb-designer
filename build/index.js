"use strict";

var _designer = _interopRequireDefault(require("./designer"));

var _createDeisgnDocument = _interopRequireDefault(require("./createDeisgnDocument"));

var _createTestContext = _interopRequireDefault(require("./createTestContext"));

var _testEnvironment = require("./testing/testEnvironment");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  designer: _designer.default,
  createDesignDocument: _createDeisgnDocument.default,
  createTestContext: _createTestContext.default,
  viewResult: _testEnvironment.viewResult
};