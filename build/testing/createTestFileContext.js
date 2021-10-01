"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _testStatSupplement = _interopRequireDefault(require("./testStatSupplement"));

var _createTestContextModule = _interopRequireDefault(require("./createTestContextModule"));

var _createTestSectionFromModule = _interopRequireDefault(require("./createTestSectionFromModule"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createTestFileContext = (oldStats, fileStat, contextProps, signal) => {
  if (!signal.aborted) {
    return new Promise((resolve, reject) => {
      (0, _testStatSupplement.default)(oldStats, fileStat).then(fileStats => {
        if (fileStats.isModified) {
          (0, _createTestContextModule.default)(fileStats, contextProps, signal).then(() => {
            (0, _createTestSectionFromModule.default)(fileStats, contextProps).then(resolve, reject);
          }, reject);
        } else {
          (0, _createTestSectionFromModule.default)(fileStats, contextProps).then(resolve, reject);
        }
      }, err => reject(err));
    });
  }
};

var _default = createTestFileContext;
exports.default = _default;