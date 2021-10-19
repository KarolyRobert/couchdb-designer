"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _promises = _interopRequireDefault(require("fs/promises"));

var _path = _interopRequireDefault(require("path"));

var _createMangoIndex = _interopRequireDefault(require("./testing/mango/createMangoIndex"));

var _createCouchDBFunctions = _interopRequireDefault(require("./testing/createCouchDBFunctions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createMangoContext = (root, name, isDatabasePartitioned, contextId) => {
  return new Promise((resolve, reject) => {
    let mangoContext = {
      id: `_design/${name}`,
      language: 'query',
      views: {}
    };
    let contextProps = {
      root,
      name,
      contextId
    };

    let filePath = _path.default.join(root, name);

    _promises.default.readFile(filePath).then(fileContent => {
      try {
        let mangoJson = JSON.parse(fileContent);
        let keys = Object.keys(mangoJson).filter(field => field !== 'partitioned');

        if (mangoJson.partitioned && !isDatabasePartitioned) {
          throw `You cannot create partitioned indexes in a non partitioned database! You can fix it in ${filePath}.`;
        }

        Promise.all(keys.map(indexName => (0, _createMangoIndex.default)(mangoJson[indexName], indexName, contextProps))).then(views => {
          for (let view of views) {
            mangoContext.views = Object.assign(mangoContext.views, view);
          }

          (0, _createCouchDBFunctions.default)(contextId, mangoContext, name);
          resolve(mangoContext);
        }, reject);
      } catch (err) {
        reject(err);
      }
    }, reject);
  });
};

var _default = createMangoContext;
exports.default = _default;