"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createTestViewFunction = _interopRequireDefault(require("./views/createTestViewFunction"));

var _testBuiltIns = _interopRequireDefault(require("./testBuiltIns"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let couchdbSections = {
  views: 'view'
};

const createCouchDBFunctions = (contextName, context) => {
  const relatedFunctions = {
    views: _createTestViewFunction.default
  };

  const server = _testBuiltIns.default.server(contextName);

  const sectionKeys = Object.keys(couchdbSections);

  for (let section of sectionKeys) {
    let functionNames = Object.keys(context[section]);

    for (let functionName of functionNames) {
      let functionSection = relatedFunctions[section](contextName, functionName);

      if (!server[couchdbSections[section]]) {
        server[couchdbSections[section]] = {};
      }

      server[couchdbSections[section]][functionName] = functionSection;
    }
  }
};

var _default = createCouchDBFunctions;
exports.default = _default;