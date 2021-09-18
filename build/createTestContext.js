"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTestContext;

var _createSectionFromDirectory = _interopRequireDefault(require("./section/createSectionFromDirectory"));

var _testEnvironment = require("../build/testing/testEnvironment");

var _crypto = _interopRequireDefault(require("crypto"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createTestContext(directoryName) {
  return new Promise((resolve, reject) => {
    let contextName = _crypto.default.createHash('md5').update(directoryName).digest('hex');

    let name = directoryName.split(_path.default.sep).pop();

    let root = _path.default.join(directoryName, '..');

    let testContext = {
      id: `_design/${name}`
    };
    const controller = new AbortController();
    const {
      signal
    } = controller;
    (0, _createSectionFromDirectory.default)(root, name, contextName, signal).then(section => {
      testContext = Object.assign(testContext, section[name]);
      (0, _testEnvironment.registerContext)(testContext, contextName);
      resolve(testContext);
    }, err => {
      controller.abort();
      reject(err);
    });
  });
}