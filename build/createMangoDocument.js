"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _promises = _interopRequireDefault(require("fs/promises"));

var _path = _interopRequireDefault(require("path"));

var _mangoFields = _interopRequireDefault(require("./util/mangoFields"));

var _compileSelector = _interopRequireDefault(require("./util/compileSelector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createMangoDocument = (root, name) => {
  return new Promise((resolve, reject) => {
    let ddoc = {
      _id: `_design/${name.split('.')[0]}`,
      language: 'query',
      views: {}
    };

    let file = _path.default.join(root, name);

    _promises.default.readFile(file).then(fileContent => {
      try {
        let json = JSON.parse(fileContent);
        let keys = Object.keys(json);

        for (let key of keys) {
          if (key === 'partitioned') {
            if (json.partitioned) {
              ddoc.options = {
                partitioned: true
              };
            } else {
              ddoc.options = {
                partitioned: false
              };
            }
          } else {
            let view = {
              map: {
                fields: (0, _mangoFields.default)(json[key].fields, file, key),
                partial_filter_selector: json[key].partial_filter_selector ? (0, _compileSelector.default)(json[key].partial_filter_selector, file, key) : {}
              },
              reduce: '_count',
              options: {
                def: json[key]
              }
            };
            ddoc.views[key] = view;
          }
        }

        resolve(ddoc);
      } catch (err) {
        reject(err);
      }
    }, reject);
  });
};

var _default = createMangoDocument;
exports.default = _default;