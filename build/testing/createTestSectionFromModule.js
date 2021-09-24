"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _loadTestModule = _interopRequireDefault(require("./loadTestModule"));

var _testEnvironment = require("../../build/testing/testEnvironment");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const creteTestSectionFromModule = (fileStats, contextName) => {
  return new Promise((resolve, reject) => {
    (0, _loadTestModule.default)(fileStats).then(testModule => {
      let testModuleKeys = Object.keys(testModule);
      let buildIns = (0, _testEnvironment.getTestContext)(contextName).buildIns;

      if (!fileStats.isLib && testModuleKeys.length === 1 && testModuleKeys[0] === fileStats.name) {
        // TODO: need find if it is realy a view
        resolve({
          [fileStats.name]: jest.fn((...args) => {
            if (testModuleKeys[0] === 'map') {
              buildIns.environmentEmit.mockImplementation((...emitargs) => {
                buildIns.contextedEmit(args[0], ...emitargs);
              });
            } else {
              buildIns.environmentEmit.mockImplementation(() => {
                throw new Error('Calling emit allows only views map function!');
              });
            }

            if (testModuleKeys[0] === 'reduce') {
              buildIns.environmentRequire.mockImplementation(() => {
                throw new Error(`Calling require from reduce function in is not allowed! You can fix it in ${fileStats.filePath}`);
              });
            } else {
              buildIns.environmentRequire.mockImplementation(requirePath => buildIns.contextedRequire(requirePath));
            }

            return testModule[testModuleKeys[0]](...args);
          })
        });
      } else {
        let testElementsObject = {
          __sourceProperties__: fileStats
        };

        for (let moduleElementName of testModuleKeys) {
          if (typeof testModule[moduleElementName] === 'function') {
            testElementsObject[moduleElementName] = jest.fn((...args) => {
              if (moduleElementName === 'map') {
                buildIns.environmentEmit.mockImplementation((...emitargs) => {
                  buildIns.contextedEmit(args[0], ...emitargs);
                });
              } else {
                buildIns.environmentEmit.mockImplementation(() => {
                  throw new Error('Call emit allows only views map function!');
                });
              }

              if (moduleElementName === 'reduce') {
                buildIns.environmentRequire.mockImplementation(() => {
                  throw new Error(`Calling require from reduce function in is not allowed! You can fix it in ${fileStats.filePath}`);
                });
              } else {
                buildIns.environmentRequire.mockImplementation(requirePath => buildIns.contextedRequire(requirePath));
              }

              return testModule[moduleElementName](...args);
            });
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