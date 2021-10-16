"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = designer;

var _promises = _interopRequireDefault(require("fs/promises"));

var _createDeisgnDocument = _interopRequireDefault(require("./createDeisgnDocument"));

var _createMangoDocument = _interopRequireDefault(require("./createMangoDocument"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function designer(root) {
  return new Promise((resolve, reject) => {
    _promises.default.readdir(root).then(names => {
      Promise.all(names.map(name => {
        if (/.*\.json$/.test(name.toLowerCase())) {
          return (0, _createMangoDocument.default)(root, name);
        } else {
          return (0, _createDeisgnDocument.default)(_path.default.join(root, name));
        }
      })).then(resolve, reject);
    }, err => reject(err));
  });
}