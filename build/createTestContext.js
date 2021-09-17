"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTestContext;

var _createSectionFromDirectory = _interopRequireDefault(require("./createSectionFromDirectory"));

var _testEnvironment = require("./testing/testEnvironment");

var _path = _interopRequireDefault(require("./path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createTestContext(directoryName) {
  return new Promise((resolve, reject) => {
    let name = directoryName.split(_path.default.sep).pop();

    let root = _path.default.join(directoryName, '..');

    let testContext = {
      id: `_design/${name}`
    };
    (0, _createSectionFromDirectory.default)(root, name, name).then(section => {
      testContext = Object.assign(testContext, section[name]);
      (0, _testEnvironment.registerContext)(testContext, name);
      resolve(testContext);
    }, err => reject(err));
  });
}