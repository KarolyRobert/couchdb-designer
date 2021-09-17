"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jest = _interopRequireDefault(require("jest"));

var _loadTestModule = _interopRequireDefault(require("./loadTestModule"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const creteTestSectionFromModule = fileStats => {
  return new Promise((resolve, reject) => {
    (0, _loadTestModule.default)(fileStats).then(testModule => {
      let testModuleKeys = Object.keys(testModule);

      if (!fileStats.isLib && testModuleKeys.length === 1 && testModuleKeys[0] === fileStats.name) {
        resolve({
          [fileStats.name]: _jest.default.fn(function () {
            return testModule[0](...arguments);
          })
        });
      } else {
        let testElementsObject = {};
        testModuleKeys.forEach(moduleElementName => {
          if (typeof testModule[moduleElementName] === 'function') {
            testElementsObject[moduleElementName] = _jest.default.fn(function () {
              return testModule[moduleElementName](...arguments);
            });
          } else {
            testElementsObject[moduleElementName] = testModule[moduleElementName];
          }
        });
        resolve({
          [fileStats.name]: testElementsObject
        });
      }
    }, err => reject(err));
  });
};

var _default = creteTestSectionFromModule;
exports.default = _default;