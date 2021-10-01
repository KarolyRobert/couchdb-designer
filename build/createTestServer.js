"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _promises = _interopRequireDefault(require("fs/promises"));

var _createTestContext = _interopRequireDefault(require("./createTestContext"));

var _testEnvironment = require("../build/testing/testEnvironment");

var _testBuiltIns = _interopRequireDefault(require("./testing/testBuiltIns"));

var _createCouchDBFunctions = _interopRequireDefault(require("./testing/createCouchDBFunctions"));

var _crypto = _interopRequireDefault(require("crypto"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createTestServer = (directoryName, testDatabase, userCtx, secObj) => {
  return new Promise((resolve, reject) => {
    let root = _path.default.join(directoryName);

    let fullPath = _path.default.resolve(process.env.PWD, root);

    let contextId = _crypto.default.createHash('md5').update(fullPath).digest('hex');

    _promises.default.readdir(root).then(names => {
      Promise.all(names.map(name => (0, _createTestContext.default)(_path.default.join(directoryName, name), null, null, null, contextId))).then(designContexts => {
        let serverContext = need => {
          if (need in _testBuiltIns.default) {
            return _testBuiltIns.default[need](contextId);
          } else {
            throw `${need} is not supported! Try "server","emitted","logged" or the needed built-in mockFunction!`;
          }
        };

        let database = {
          _validators: [],
          database: testDatabase
        };

        for (let designContext of designContexts) {
          if (designContext) {
            let designName = designContext.id.split('/')[1];

            if (designContext.language.toLowerCase() === 'javascript') {
              (0, _createCouchDBFunctions.default)(contextId, designContext, designName);
            }

            serverContext[designName] = designContext;

            if (designContext.validate_doc_update) {
              database._validators.push({
                parentName: designContext.id,
                validator: designContext.validate_doc_update
              });
            }
          }
        }

        (0, _testEnvironment.registerContext)(contextId, serverContext, database, userCtx, secObj);
        resolve(serverContext);
      }).catch(err => reject(err));
    }, err => reject(err));
  });
};

var _default = createTestServer;
exports.default = _default;