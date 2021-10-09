"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _testEnvironment = require("../../build/testing/testEnvironment");

var _createMockFunction = _interopRequireDefault(require("./createMockFunction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createTestJavascriptModule = (contextId, fileContent) => {
  const {
    require,
    emit,
    log,
    sum,
    getRow,
    provides,
    registerType,
    start,
    send,
    index
  } = (0, _testEnvironment.testEnvironment)(contextId);
  const toJSON = JSON.stringify;
  const isArray = Array.isArray;
  return eval(fileContent);
};

const createTestJavascriptSection = (fileStats, contextProps, fileContent) => {
  return new Promise((resolve, reject) => {
    try {
      const testModule = createTestJavascriptModule(contextProps.contextId, fileContent);

      if (testModule && Object.keys(testModule).length > 0) {
        let testModuleKeys = Object.keys(testModule);

        if (!fileStats.isLib && testModuleKeys.length === 1 && testModuleKeys[0] === fileStats.name) {
          const mockFunction = (0, _createMockFunction.default)(fileStats, contextProps, testModuleKeys[0], testModule[testModuleKeys[0]]);
          resolve({
            [fileStats.name]: mockFunction
          });
        } else {
          let testElementsObject = {
            __sourceProperties__: fileStats
          };

          for (let moduleElementName of testModuleKeys) {
            if (typeof testModule[moduleElementName] === 'function') {
              const mockFunction = (0, _createMockFunction.default)(fileStats, contextProps, moduleElementName, testModule[moduleElementName]);
              testElementsObject[moduleElementName] = mockFunction;
            } else {
              testElementsObject[moduleElementName] = testModule[moduleElementName];
            }
          }

          resolve({
            [fileStats.name]: testElementsObject
          });
        }
      } else {
        reject(`The module ${fileStats.filePath} does not exist't export anything! You must export function/s with module.exports = {...}`);
      }
    } catch (moduleError) {
      reject(`Can not evaluate ${fileStats.filePath}\n ${moduleError.message}`);
    }
  });
};

var _default = createTestJavascriptSection;
exports.default = _default;