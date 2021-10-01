"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createDesignDocument;

var _createSectionFromDirectory = _interopRequireDefault(require("./section/createSectionFromDirectory"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createDesignDocument(root) {
  return new Promise((resolve, reject) => {
    let name = root.split(_path.default.sep).pop();

    let directory = _path.default.join(root, '..');

    let designDocument = {
      _id: `_design/${name}`
    };
    designDocument.language = 'javascript';
    (0, _createSectionFromDirectory.default)(directory, name).then(section => {
      resolve(Object.assign(designDocument, section[name]));
    }, err => reject(err));
  });
}