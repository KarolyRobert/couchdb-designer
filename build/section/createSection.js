"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _promises = _interopRequireDefault(require("fs/promises"));

var _createDesignSectionFromFile = _interopRequireDefault(require("./createDesignSectionFromFile"));

var _createTestSectionFromFile = _interopRequireDefault(require("../testing/createTestSectionFromFile"));

var _createSectionFromDirectory = _interopRequireDefault(require("./createSectionFromDirectory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createSection = (directory, name, contextProps) => {
  return new Promise((resolve, reject) => {
    let sectionPath = _path.default.join(directory, name);

    _promises.default.stat(sectionPath).then(fileStat => {
      if (fileStat.isFile() || fileStat.isDirectory()) {
        if (fileStat.isFile()) {
          if (contextProps) {
            (0, _createTestSectionFromFile.default)(directory, name, contextProps).then(resolve, reject);
          } else {
            (0, _createDesignSectionFromFile.default)(directory, name).then(resolve, reject);
          }
        } else {
          (0, _createSectionFromDirectory.default)(directory, name, contextProps).then(resolve, reject);
        }
      } else {
        reject(`Bad structure! ${sectionPath} must be file or directory!`);
      }
    }, err => reject(err));
  });
};

var _default = createSection;
exports.default = _default;