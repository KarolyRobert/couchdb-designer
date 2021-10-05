"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _testBuiltIns = _interopRequireDefault(require("../testing/testBuiltIns"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const contextFunction = contextId => {
  return (need, params) => {
    if (need in _testBuiltIns.default) {
      return _testBuiltIns.default[need](contextId, params);
    } else {
      throw `${need} is not supported! The list of available opportunities is in README.md`;
    }
  };
};

var _default = contextFunction;
exports.default = _default;