"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTestContext;

var _createSectionFromDirectory = _interopRequireDefault(require("./section/createSectionFromDirectory"));

var _testEnvironment = require("../build/testing/testEnvironment");

var _createCouchDBFunctions = _interopRequireDefault(require("./testing/createCouchDBFunctions"));

var _testBuiltIns = _interopRequireDefault(require("./testing/testBuiltIns"));

var _crypto = _interopRequireDefault(require("crypto"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createTestContext(directoryName, testDatabase) {
  if (process.env.JEST_WORKER_ID === undefined) {
    throw new Error('createTestContext can only be used inside Jest Framework!');
  }

  return new Promise((resolve, reject) => {
    let root = _path.default.join(directoryName);

    let fullPath = _path.default.resolve(process.env.PWD, root);

    let contextName = _crypto.default.createHash('md5').update(fullPath).digest('hex');

    let name = root.split(_path.default.sep).pop();

    let directory = _path.default.join(root, '..');

    let testContext = need => {
      if (need in _testBuiltIns.default) {
        return _testBuiltIns.default[need](contextName);
      } else {
        throw `${need} is not supported! Try "server","emitted","logged" or the needed built-in mockFunction!`;
      }
    };

    testContext.id = `_design/${name}`;
    const controller = new AbortController();
    const {
      signal
    } = controller;
    (0, _createSectionFromDirectory.default)(directory, name, {
      root,
      contextName
    }, signal).then(section => {
      testContext = Object.assign(testContext, section[name]);
      (0, _createCouchDBFunctions.default)(contextName, testContext);
      (0, _testEnvironment.registerContext)(testContext, testDatabase, contextName);
      resolve(testContext);
    }, err => {
      controller.abort();
      reject(err);
    });
  });
}