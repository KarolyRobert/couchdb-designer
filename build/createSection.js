"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _promises = _interopRequireDefault(require("fs/promises"));

var _createSectionFromFile = _interopRequireDefault(require("./createSectionFromFile"));

var _createSectionFromDirectory = _interopRequireDefault(require("./createSectionFromDirectory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createSection = (directory, name) => {
  return new Promise((resolve, reject) => {
    let sectionPath = _path.default.join(directory, name);

    _promises.default.stat(sectionPath).then(stat => {
      if (stat.isFile() || stat.isDirectory()) {
        if (stat.isFile()) {
          (0, _createSectionFromFile.default)(directory, name).then(result => resolve(result), err => reject(err));
        } else {
          (0, _createSectionFromDirectory.default)(directory, name).then(result => resolve(result), err => reject(err));
        }
      } else {
        reject(`Bad structure! ${sectionPath} must be file or directory!`);
      }
    }, err => reject(err));
  });
};

var _default = createSection;
exports.default = _default;