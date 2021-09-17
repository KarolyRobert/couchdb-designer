"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractFileStats;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function extractFileStats(directory, fileName) {
  let fileParts = fileName.split('.');
  let isJSON = fileParts[fileParts.length - 1].toLowerCase() === 'json';
  let isJavaScript = fileParts[fileParts.length - 1].toLowerCase() === 'js';
  let isLib = false;
  let name = fileParts[0];

  let filePath = _path.default.join(directory, fileName);

  if (!isJSON && fileParts.length === 3) isLib = true;
  return {
    isJSON,
    isLib,
    name,
    filePath,
    isJavaScript
  };
}