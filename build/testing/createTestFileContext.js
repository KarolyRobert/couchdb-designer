"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _testStatSupplement = require("./testStatSupplement");

var _createTestSectionFromModule = _interopRequireDefault(require("./createTestSectionFromModule"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createTestFileContext = (oldStats, fileStat, testContextName) => {
  return new Promise((resolve, reject) => {
    (0, _testStatSupplement.testStatSupplement)(oldStats, fileStat).then(fileStats => {
      if (fileStats.isModified) {} else {
        (0, _createTestSectionFromModule.default)(fileStats).then(resolve, reject);
      }
    }, err => reject(err));
  });
};

var _default = createTestFileContext;
exports.default = _default;