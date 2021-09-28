"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _promises = _interopRequireDefault(require("fs/promises"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createTestContextModule = (fileStats, testContextName, signal) => {
  if (!signal.aborted) {
    return new Promise((resolve, reject) => {
      _promises.default.readFile(fileStats.filePath, {
        encoding: 'utf8'
      }).then(content => {
        let moduleContent = `const environment = require('../build/testing/testEnvironment').testEnvironment("${testContextName}");\n` + 'require = environment.require;\n' + 'const emit = environment.emit;\n' + 'const log = environment.log;\n' + 'const isArray = Array.isArray;\n' + 'const sum = environment.sum;\n' + 'const toJSON = environment.toJSON;\n' + 'const getRow = environment.getRow;\n' + 'const provides = environment.provides;\n' + 'const registerType = environment.registerType;\n' + 'const start = environment.start;\n' + 'const send = environment.send;\n';

        if (fileStats.isLib) {
          moduleContent += 'const exports = module.exports;\n';
        }

        moduleContent += `//Original content \n${content}\n`;

        _promises.default.writeFile(_path.default.resolve(__dirname, fileStats.testPath), moduleContent, {
          signal
        }).then(resolve, reject);
      }, err => reject(err));
    });
  }
};

var _default = createTestContextModule;
exports.default = _default;