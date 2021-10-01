"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = designer;

var _promises = _interopRequireDefault(require("fs/promises"));

var _createDeisgnDocument = _interopRequireDefault(require("./createDeisgnDocument"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function designer(root) {
  return new Promise((resolve, reject) => {
    _promises.default.readdir(root).then(names => {
      Promise.all(names.map(name => (0, _createDeisgnDocument.default)(_path.default.join(root, name)))).then(documents => resolve(documents)).catch(err => reject(err));
    }, err => reject(err));
  });
}