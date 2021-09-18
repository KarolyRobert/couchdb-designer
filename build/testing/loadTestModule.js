"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadTestModule;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadTestModule(fileStats) {
  return new Promise((resolve, reject) => {
    try {
      //console.log(fileStats);
      let modulePath = _path.default.resolve(__dirname, fileStats.testModule);

      const jsModule = require(_path.default.resolve(__dirname, fileStats.testModule));

      if (Object.keys(jsModule).length > 0) {
        resolve(jsModule);
      } else {
        reject(new Error(`The module ${modulePath} does not exist't export anything! You must export function/s with module.exports = {...}`));
      }
    } catch (err) {
      reject(err);
    }
  });
}