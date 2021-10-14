"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTestContext;

var _createSectionFromDirectory = _interopRequireDefault(require("./section/createSectionFromDirectory"));

var _testEnvironment = require("../build/testing/testEnvironment");

var _updateDocument = require("./testing/changes/updateDocument");

var _createCouchDBFunctions = _interopRequireDefault(require("./testing/createCouchDBFunctions"));

var _defaults = _interopRequireDefault(require("./testing/defaults"));

var _contextFunction = _interopRequireDefault(require("./util/contextFunction"));

var _crypto = _interopRequireDefault(require("crypto"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createTestContext(directoryName, testDatabase, userCtx = _defaults.default.userCtx, secObj = _defaults.default.secObj, parentContext = false) {
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
      testContext = (0, _contextFunction.default)(contextId);
    }

    testContext.id = `_design/${name}`;
    testContext.language = 'javascript';
    (0, _createSectionFromDirectory.default)(directory, name, contextProps).then(section => {
      testContext = Object.assign(testContext, section[name]);

      if (!testDatabase.partitioned && testContext.options && testContext.options.partitioned) {
        reject('partitioned option cannot be true in a non-partitioned database.');
      } else {
        if (testContext.language.toLowerCase() === 'javascript') {
          if (testContext.validate_doc_update) {
            (0, _testEnvironment.addValidator)(contextProps.contextId, testContext.id, testContext.validate_doc_update);
          }

          if (!parentContext) {
            (0, _createCouchDBFunctions.default)(contextProps.contextId, testContext);
            (0, _testEnvironment.registerContext)(contextProps.contextId, testContext, 'context', userCtx, secObj);
            (0, _updateDocument.registerDatabase)(contextProps.contextId, testDatabase, userCtx);
          } else {
            (0, _createCouchDBFunctions.default)(contextProps.contextId, testContext, name);
          }

          resolve(testContext);
        } else if (!parentContext) {
          reject(`Only "javascript" type design document testing is supported yet. This directory structure defining one "${testContext.language}" type design document!`);
        } else {
          resolve(testContext);
        }
      }
    }, err => {
      reject(err);
    });
  });
}