"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createTestViewFunction = _interopRequireDefault(require("./views/createTestViewFunction"));

var _createTestUpdateFunction = _interopRequireDefault(require("./updates/createTestUpdateFunction"));

var _testBuiltIns = _interopRequireDefault(require("./testBuiltIns"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let couchdbSections = {
  views: 'view',
  updates: 'update'
};

const createCouchDBFunctions = (contextName, context, parent = false) => {
  const relatedFunctions = {
    views: _createTestViewFunction.default,
    updates: _createTestUpdateFunction.default
  };

  let server = _testBuiltIns.default.server(contextName);

  if (parent) {
    if (!server[parent]) {
      server[parent] = {};
    }
  }

  const sectionKeys = Object.keys(couchdbSections);

  for (let section of sectionKeys) {
    let functionNames = Object.keys(context[section]);

    for (let functionName of functionNames) {
      let functionSection = relatedFunctions[section](contextName, functionName, context);

      if (parent) {
        if (!server[parent][couchdbSections[section]]) {
          server[parent][couchdbSections[section]] = {};
        }

        server[parent][couchdbSections[section]][functionName] = functionSection;
      } else {
        if (!server[couchdbSections[section]]) {
          server[couchdbSections[section]] = {};
        }

        server[couchdbSections[section]][functionName] = functionSection;
      }
    }
  }
};

var _default = createCouchDBFunctions;
exports.default = _default;