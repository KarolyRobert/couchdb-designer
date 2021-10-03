"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _promises = _interopRequireDefault(require("fs/promises"));

var _loadModule = _interopRequireDefault(require("../util/loadModule"));

var _extractFileStats = _interopRequireDefault(require("../util/extractFileStats"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const nameRegexp = /^function\s{1,}(\S{1,})\s{0,}\(/;

const createDesignSectionFromFile = (directory, fileName) => {
  return new Promise((resolve, reject) => {
    let fileStats = (0, _extractFileStats.default)(directory, fileName);

    if (!fileStats.isJavaScript || fileStats.isLib) {
      _promises.default.readFile(fileStats.filePath, {
        encoding: 'utf8'
      }).then(content => {
        if (fileStats.isJSON) {
          try {
            let jsonObject = JSON.parse(content.trim());
            resolve({
              [fileStats.name]: jsonObject
            });
          } catch (err) {
            reject(`Bad content in ${fileStats.filePath}. It must be valid json! ${err.message}`);
          }
        } else {
          resolve({
            [fileStats.name]: content.trim()
          });
        }
      }, err => reject(`Bad structure! ${fileStats.filePath} must be regular file! ${err.message}`));
    } else {
      (0, _loadModule.default)(directory, fileStats.name).then(designModule => {
        let moduleKeys = Object.keys(designModule);

        if (moduleKeys.length === 1 && moduleKeys[0] === fileStats.name) {
          let functionString = designModule[moduleKeys[0]].toString();
          let designFunction = functionString.replace(nameRegexp, 'function (');
          resolve({
            [fileStats.name]: designFunction
          });
        } else {
          let moduleElementsObject = {};
          moduleKeys.forEach(elementName => {
            if (typeof designModule[elementName] === 'function') {
              let functionString = designModule[elementName].toString();
              let designFunction = functionString.replace(nameRegexp, 'function (');
              moduleElementsObject = Object.assign(moduleElementsObject, {
                [elementName]: designFunction
              });
            } else {
              moduleElementsObject = Object.assign(moduleElementsObject, {
                [elementName]: designModule[elementName]
              });
            }
          });
          resolve({
            [fileStats.name]: moduleElementsObject
          });
        }
      }, err => reject(`Can't load module from ${fileStats.filePath}! ${err.message}`));
    }
  });
};

var _default = createDesignSectionFromFile;
exports.default = _default;