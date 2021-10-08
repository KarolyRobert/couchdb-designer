"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _promises = _interopRequireDefault(require("fs/promises"));

var _extractFileStats = _interopRequireDefault(require("../util/extractFileStats"));

var _createTestJavascriptSection = _interopRequireDefault(require("./createTestJavascriptSection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const creteTestSectionFromFile = (directory, fileName, contextProps) => {
  return new Promise((resolve, reject) => {
    let fileStats = (0, _extractFileStats.default)(directory, fileName, contextProps);

    _promises.default.readFile(fileStats.filePath, {
      encoding: 'utf8'
    }).then(content => {
      if (!fileStats.isJavaScript) {
        if (fileStats.isJSON) {
          try {
            let jsonObject = JSON.parse(content.trim());
            resolve({
              [fileStats.name]: jsonObject
            });
          } catch (err) {
            reject(`Bad JSON format in ${fileStats.filePath}! ${err.message}`);
          }
        } else {
          resolve({
            [fileStats.name]: content.trim()
          });
        }
      } else {
        (0, _createTestJavascriptSection.default)(fileStats, contextProps, content).then(resolve, reject);
      }
    }, err => reject(`Bad structure! ${fileStats.filePath} must be regular file! ${err.message}`));
  });
};

var _default = creteTestSectionFromFile;
exports.default = _default;