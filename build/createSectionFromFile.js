"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _promises = _interopRequireDefault(require("fs/promises"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createSectionFromFile = (directory, fileName) => {
  return new Promise((resolve, reject) => {
    let filePath = _path.default.join(directory, fileName);

    let sectionName = fileName.split('.')[0];
    let isJSON = fileName.split('.').pop() === 'json';

    _promises.default.readFile(filePath, {
      encoding: 'utf8'
    }).then(content => {
      if (isJSON) {
        try {
          let jsonObject = JSON.parse(content.trim());
          resolve({
            [sectionName]: jsonObject
          });
        } catch (err) {
          reject(`Bad content in ${filePath}. It must be valid json! ${err.message}`);
        }
      } else {
        resolve({
          [sectionName]: content.trim()
        });
      }
    }, err => reject(`Bad structure! ${filePath} must be regular file! ${err.message}`));
  });
};

var _default = createSectionFromFile;
exports.default = _default;