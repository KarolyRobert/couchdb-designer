"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _promises = _interopRequireDefault(require("fs/promises"));

var _loadModule = _interopRequireDefault(require("./loadModule"));

var _extractFileStats = _interopRequireDefault(require("./extractFileStats"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const creteTestSectionFromFile = (directory, fileName) => {
  return new Promise((resolve, reject) => {
    let fileStats = (0, _extractFileStats.default)(directory, fileName);
  });
};

var _default = creteTestSectionFromFile;
exports.default = _default;