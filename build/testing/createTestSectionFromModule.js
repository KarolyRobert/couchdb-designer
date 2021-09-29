"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _loadTestModule = _interopRequireDefault(require("./loadTestModule"));

var _createMockFunction = _interopRequireDefault(require("./createMockFunction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const creteTestSectionFromModule = (fileStats, contextName) => {
  return new Promise((resolve, reject) => {
    (0, _loadTestModule.default)(fileStats).then(testModule => {
      let testModuleKeys = Object.keys(testModule);

      if (!fileStats.isLib && testModuleKeys.length === 1 && testModuleKeys[0] === fileStats.name) {
        const mockFunction = (0, _createMockFunction.default)(fileStats, contextName, testModuleKeys[0], testModule[testModuleKeys[0]]);
        resolve({
          [fileStats.name]: mockFunction
        });
      } else {
        let testElementsObject = {
          __sourceProperties__: fileStats
        };

        for (let moduleElementName of testModuleKeys) {
          if (typeof testModule[moduleElementName] === 'function') {
            const mockFunction = (0, _createMockFunction.default)(fileStats, contextName, moduleElementName, testModule[moduleElementName]);
            testElementsObject[moduleElementName] = mockFunction;
          } else {
            testElementsObject[moduleElementName] = testModule[moduleElementName];
          }
        }

        resolve({
          [fileStats.name]: testElementsObject
        });
      }
    }, err => reject(err));
  });
};

var _default = creteTestSectionFromModule;
exports.default = _default;