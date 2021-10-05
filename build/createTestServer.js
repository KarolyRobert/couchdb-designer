"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _promises = _interopRequireDefault(require("fs/promises"));

var _createTestContext = _interopRequireDefault(require("./createTestContext"));

var _testEnvironment = require("../build/testing/testEnvironment");

var _contextFunction = _interopRequireDefault(require("./util/contextFunction"));

var _defaults = _interopRequireDefault(require("./testing/defaults"));

var _updateDocument = require("./testing/changes/updateDocument");

var _crypto = _interopRequireDefault(require("crypto"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import testBuiltIns from './testing/testBuiltIns';
const createTestServer = (directoryName, testDatabase, userCtx = _defaults.default.userCtx, secObj = _defaults.default.secObj) => {
  return new Promise((resolve, reject) => {
    let root = _path.default.join(directoryName);

    let fullPath = _path.default.resolve(process.env.PWD, root);

    let contextId = _crypto.default.createHash('md5').update(fullPath).digest('hex');

    _promises.default.readdir(root).then(names => {
      Promise.all(names.map(name => (0, _createTestContext.default)(_path.default.join(directoryName, name), null, null, null, contextId))).then(designContexts => {
        let serverContext = (0, _contextFunction.default)(contextId);

        for (let designContext of designContexts) {
          if (designContext) {
            let designName = designContext.id.split('/')[1];
            serverContext[designName] = designContext;
          }
        }

        (0, _testEnvironment.registerContext)(contextId, serverContext, 'server', userCtx, secObj);
        (0, _updateDocument.registerDatabase)(contextId, testDatabase, userCtx);
        resolve(serverContext);
      }).catch(err => reject(err));
    }, err => reject(err));
  });
};

var _default = createTestServer;
exports.default = _default;