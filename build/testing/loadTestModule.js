"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadTestModule;

var _path = _interopRequireDefault(require("path"));

var _promises = _interopRequireDefault(require("fs/promises"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadTestModule(fileStats) {
  return new Promise((resolve, reject) => {
    jest.useFakeTimers();

    const jsModule = require(_path.default.resolve(__dirname, fileStats.testModule));

    if (Object.keys(jsModule).length > 0) {
      resolve(jsModule);
    } else {
      _promises.default.rm(fileStats.testPath, {
        force: true,
        maxRetries: 10
      }).then(() => {
        reject(`The module ${fileStats.filePath} does not exist't export anything! You must export function/s with module.exports = {...}`);
      }, err => reject(err));
    }
  });
}