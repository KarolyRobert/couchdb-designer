"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _promises = _interopRequireDefault(require("fs/promises"));

var _createSection = _interopRequireDefault(require("./createSection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createSectionFromDirectory = (directory, sectionName, contextName = false, signal = {
  aborted: false
}) => {
  if (!signal.aborted) {
    return new Promise((resolve, reject) => {
      let directoryPath = _path.default.join(directory, sectionName);

      _promises.default.readdir(directoryPath).then(names => {
        Promise.all(names.map(name => {
          return (0, _createSection.default)(directoryPath, name, contextName, signal);
        })).then(sections => {
          let directorySection = {};

          for (let section of sections) {
            if (directorySection.hasOwnProperty(Object.keys(section)[0])) {
              let sectionKey = Object.keys(section)[0];
              directorySection[sectionKey] = Object.assign(directorySection[sectionKey], section[sectionKey]);
            } else {
              directorySection = Object.assign(directorySection, section);
            }
          }

          resolve({
            [sectionName]: directorySection
          });
        }, err => reject(err));
      }, err => reject(`Bad structure! ${directoryPath} must be a directory! ${err.message}`));
    });
  }
};

var _default = createSectionFromDirectory;
exports.default = _default;