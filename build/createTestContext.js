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

function createTestContext(directoryName, testDatabase, userCtx, secObj, parentContext = false) {
  if (process.env.JEST_WORKER_ID === undefined) {
    throw new Error('createTestContext can only be used inside Jest Framework!');
  }

  return new Promise((resolve, reject) => {
    let testContext;
    let contextProps;

    let root = _path.default.join(directoryName);

    let name = root.split(_path.default.sep).pop();

    let directory = _path.default.join(root, '..');

    if (parentContext) {
      contextProps = {
        root,
        name,
        contextId: parentContext
      };
      testContext = {};
    } else {
      let fullPath = _path.default.resolve(process.env.PWD, root);

      let contextId = _crypto.default.createHash('md5').update(fullPath).digest('hex');

      contextProps = {
        root,
        contextId
      };

      testContext = (need, params) => {
        if (need in _testBuiltIns.default) {
          return _testBuiltIns.default[need](contextId, params);
        } else {
          throw `${need} is not supported! Try "server","emitted","logged" or the needed built-in mockFunction!`;
        }
      };
    }

    testContext.id = `_design/${name}`;
    testContext.language = 'javascript';
    (0, _createSectionFromDirectory.default)(directory, name, contextProps).then(section => {
      testContext = Object.assign(testContext, section[name]);

      if (testContext.language.toLowerCase() === 'javascript') {
        if (!parentContext) {
          (0, _createCouchDBFunctions.default)(contextProps.contextId, testContext);
          let database = {
            _validators: [],
            database: testDatabase
          };

          if (testContext.validate_doc_update) {
            database._validators.push({
              parentName: testContext.id,
              validator: testContext.validate_doc_update
            });
          }

          (0, _testEnvironment.registerContext)(contextProps.contextId, testContext, database, userCtx, secObj);
        }

        resolve(testContext);
      } else if (!parentContext) {
        reject(`Only "javascript" type design document testing is supported yet. This directory structure defining one "${testContext.language}" type design document!`);
      } else {
        resolve(testContext);
      }
    }, err => {
      reject(err);
    });
  });
}