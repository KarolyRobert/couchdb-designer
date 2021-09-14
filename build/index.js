"use strict";

var _designer = _interopRequireDefault(require("./designer"));

var _createDeisgnDocument = _interopRequireDefault(require("./createDeisgnDocument"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  designer: _designer.default,
  createDesignDocument: _createDeisgnDocument.default
};