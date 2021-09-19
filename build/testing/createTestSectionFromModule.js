"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _globals = require("@jest/globals");

var _loadTestModule = _interopRequireDefault(require("./loadTestModule"));

var _testEnvironment = require("../../build/testing/testEnvironment");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const creteTestSectionFromModule = fileStats => {
  return new Promise((resolve, reject) => {
    (0, _loadTestModule.default)(fileStats).then(testModule => {
      let testModuleKeys = Object.keys(testModule);

      if (!fileStats.isLib && testModuleKeys.length === 1 && testModuleKeys[0] === fileStats.name) {
        //resolve({[fileStats.name]:testModule[testModuleKeys[0]]});

        /*  let Inplement = (...args) => {
              if(testModuleKeys[0] === 'map'){
                  emitMock.mockImplementation((...emitargs) => {
                      mockEmit(args[0],...emitargs);
                  });
              }else{
                  emitMock.mockImplementation(() => {
                      throw new Error('Calling emit allows only views map function!');
                  });
              }
              return testModule[testModuleKeys[0]](...args);
          }
          Inplement.__sourceProperties__ = {isRoot:true,fileStats:fileStats};*/
        resolve({
          [fileStats.name]: _globals.jest.fn((...args) => {
            if (testModuleKeys[0] === 'map') {
              _testEnvironment.emitMock.mockImplementation((...emitargs) => {
                (0, _testEnvironment.mockEmit)(args[0], ...emitargs);
              });
            } else {
              _testEnvironment.emitMock.mockImplementation(() => {
                throw new Error('Calling emit allows only views map function!');
              });
            }

            return testModule[testModuleKeys[0]](...args);
          })
        });
      } else {
        let testElementsObject = {
          __sourceProperties__: fileStats
        };
        testModuleKeys.forEach(moduleElementName => {
          // testElementsObject[moduleElementName] = testModule[moduleElementName];
          if (typeof testModule[moduleElementName] === 'function') {
            let a;
            testElementsObject[moduleElementName] = _globals.jest.fn((...args) => {
              if (moduleElementName === 'map') {
                _testEnvironment.emitMock.mockImplementation((...emitargs) => {
                  (0, _testEnvironment.mockEmit)(args[0], ...emitargs);
                });
              } else {
                _testEnvironment.emitMock.mockImplementation(() => {
                  throw new Error('Call emit allows only views map function!');
                });
              }

              return testModule[moduleElementName](...args);
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