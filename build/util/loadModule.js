"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadModule;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadModule(directory, name) {
  return new Promise((resolve, reject) => {
    let jsModule = false;

    try {
      jsModule = require(_path.default.resolve(process.env.PWD, directory, name));

      if (Object.keys(jsModule).length > 0) {
        resolve(jsModule);
      } else {
        reject(new Error(`The module ${_path.default.join(directory, name)} doesn't export anything! You must export function/s with module.exports = {...}`));
      }
    } catch (err) {
      reject(err);
    }
  });
}