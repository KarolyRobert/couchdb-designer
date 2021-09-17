"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createDesignDocument;

var _createSectionFromDirectory = _interopRequireDefault(require("./section/createSectionFromDirectory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createDesignDocument(root, name) {
  return new Promise((resolve, reject) => {
    let designDocument = {
      _id: `_design/${name}`
    };
    designDocument.language = 'javascript';
    (0, _createSectionFromDirectory.default)(root, name).then(section => {
      resolve(Object.assign(designDocument, section[name]));
    }, err => reject(err));
  });
}