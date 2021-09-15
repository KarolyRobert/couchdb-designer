"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadModule;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadModule(directory, name) {
  return new Promise((resolve, reject) => {
    let jsModule;

    try {
      jsModule = require(_path.default.resolve(process.env.PWD, directory, name));
      resolve(jsModule);
    } catch (err) {
      reject(err);
    }
  });
}