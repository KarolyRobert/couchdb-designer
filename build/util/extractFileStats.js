"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractFileStats;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function extractFileStats(directory, fileName, root) {
  let fileParts = fileName.split('.');
  let isJSON = fileParts[fileParts.length - 1].toLowerCase() === 'json';
  let isJavaScript = fileParts[fileParts.length - 1].toLowerCase() === 'js';
  let isLib = false;
  let name = fileParts[0];
  let typePath = false;

  if (root) {
    typePath = _path.default.join(directory, name).split(root)[1].split(_path.default.sep);
    typePath.shift();
  }

  let filePath = _path.default.join(directory, fileName);

  if (isJavaScript && fileParts[fileParts.length - 2] === 'lib') isLib = true;
  return {
    isJSON,
    isLib,
    name,
    typePath,
    filePath,
    isJavaScript
  };
}