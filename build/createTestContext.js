"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTestContext;

var _createSectionFromDirectory = _interopRequireDefault(require("./section/createSectionFromDirectory"));

var _testEnvironment = require("../build/testing/testEnvironment");

var _testByPath = _interopRequireDefault(require("./testing/url/testByPath"));

var _crypto = _interopRequireDefault(require("crypto"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createTestContext(directoryName, testDatabase) {
  if (process.env.JEST_WORKER_ID === undefined) {
    throw new Error('createTestContext can only be used inside Jest Framework!');
  }

  return new Promise((resolve, reject) => {
    let fullPath = _path.default.join(process.env.PWD, directoryName);

    let contextName = _crypto.default.createHash('md5').update(fullPath).digest('hex');

    let name = directoryName.split(_path.default.sep).pop();

    let root = _path.default.join(directoryName, '..');

    let testContext = testURL => {
      return (0, _testByPath.default)(contextName, testDatabase, testURL);
    };

    testContext.id = `_design/${name}`;
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