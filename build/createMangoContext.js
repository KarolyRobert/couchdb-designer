"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _promises = _interopRequireDefault(require("fs/promises"));

var _path = _interopRequireDefault(require("path"));

var _createMangoIndex = _interopRequireDefault(require("./testing/mango/createMangoIndex"));

var _createCouchDBFunctions = _interopRequireDefault(require("./testing/createCouchDBFunctions"));

var _testEnvironment = require("../build/testing/testEnvironment");

var _compileSelector = _interopRequireDefault(require("./util/compileSelector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createIndexDef = index => {
  let def = {};
  def.fields = index.fields.map(field => {
    if (typeof field === 'string') {
      return {
        [field]: 'asc'
      };
    } else {
      return field;
    }
  });

  if (index.partial_filter_selector) {
    def.partial_filter_selector = (0, _compileSelector.default)(index.partial_filter_selector);
  }

  return def;
};

const createMangoContext = (root, name, isDatabasePartitioned, contextId) => {
  return new Promise((resolve, reject) => {
    let ddocName = name.split('.')[0];
    let mangoContext = {
      id: `_design/${ddocName}`,
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
          const {
            indexes
          } = (0, _testEnvironment.getTestContext)(contextId);

          for (let view of views) {
            let indexName = Object.keys(view)[0];
            indexes.push({
              ddoc: mangoContext.id,
              name: indexName,
              type: 'json',
              partitioned: mangoJson.partitioned ? mangoJson.partitioned : false,
              def: createIndexDef(view[indexName].options.def)
            });
            mangoContext.views = Object.assign(mangoContext.views, view);
          }

          (0, _createCouchDBFunctions.default)(contextId, mangoContext, ddocName);
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