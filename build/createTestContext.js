"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTestContext;

var _createSectionFromDirectory = _interopRequireDefault(require("./section/createSectionFromDirectory"));

var _testEnvironment = require("../build/testing/testEnvironment");

var _createCouchDBFunctions = _interopRequireDefault(require("./testing/createCouchDBFunctions"));

var _defaults = _interopRequireDefault(require("./testing/defaults"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createTestContext(directory, name, isDatabasePatritioned, contextId) {
  return new Promise((resolve, reject) => {
    let root = _path.default.join(directory, name); // let name = root.split(path.sep).pop();
    // let directory = path.join(root, '..');


    let contextProps = {
      root,
      name,
      contextId
    };
    let testContext = {
      id: `_design/${name}`,
      language: 'javascript'
    };
    (0, _createSectionFromDirectory.default)(directory, name, contextProps).then(section => {
      testContext = Object.assign(testContext, section[name]);

      if (!isDatabasePatritioned && testContext.options && testContext.options.partitioned) {
        reject('partitioned option cannot be true in a non-partitioned database.');
      } else {
        if (testContext.language.toLowerCase() === 'javascript') {
          if (testContext.validate_doc_update) {
            (0, _testEnvironment.addValidator)(contextId, testContext.id, testContext.validate_doc_update);
          }

          (0, _createCouchDBFunctions.default)(contextId, testContext, name);
          resolve(testContext);
        } else {
          if (testContext.language.toLowerCase() === 'query') {
            reject('Warning! You can testing Mango index with createTestServer by defining them in a json file under its root directory.');
          } else {
            reject(`Only "javascript" type design document testing is supported yet. This directory structure defining one "${testContext.language}" type design document!`);
          }
        }
      }
    }, err => {
      reject(err);
    });
  });
}