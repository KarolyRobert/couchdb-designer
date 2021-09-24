"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _promises = _interopRequireDefault(require("fs/promises"));

var _extractFileStats = _interopRequireDefault(require("../util/extractFileStats"));

var _createTestFileContext = _interopRequireDefault(require("./createTestFileContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const creteTestSectionFromFile = (directory, fileName, fileStat, contextName, signal) => {
  if (!signal.aborted) {
    return new Promise((resolve, reject) => {
      let fileStats = (0, _extractFileStats.default)(directory, fileName);

      if (fileStats.isJSON) {
        _promises.default.readFile(fileStats.filePath, {
          encoding: 'utf8'
        }).then(content => {
          try {
            let jsonObject = JSON.parse(content.trim());
            resolve({
              [fileStats.name]: jsonObject
            });
          } catch (err) {
            reject(`Bad JSON format in ${fileStats.filePath}! ${err.message}`);
          }
        }, err => reject(`Bad structure! ${fileStats.filePath} must be regular file! ${err.message}`));
      } else {
        (0, _createTestFileContext.default)(fileStats, fileStat, contextName, signal).then(resolve, reject); //testFileContext =>  resolve(testFileContext),err => reject(err));
      }
    });
  }
};

var _default = creteTestSectionFromFile;
exports.default = _default;