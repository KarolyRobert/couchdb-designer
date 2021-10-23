"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _testEnvironment = require("../../../build/testing/testEnvironment");

var _createMangoFilter = _interopRequireDefault(require("./createMangoFilter"));

var _getMangoIndexRows = _interopRequireDefault(require("../indexes/getMangoIndexRows"));

var _getMatchingIndex = _interopRequireDefault(require("../../util/getMatchingIndex"));

var _createFieldsMap = _interopRequireDefault(require("../../util/createFieldsMap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createMangoFind = contextId => {
  return (query, partition) => {
    let context = (0, _testEnvironment.getTestContext)(contextId);
    let filter = (0, _createMangoFilter.default)(query.selector);
    let index = (0, _getMatchingIndex.default)(context.indexes, query, partition);
    let indexRows = (0, _getMangoIndexRows.default)(context, index, partition);
    let documents = indexRows.map(({
      id
    }) => {
      for (let doc of context.database.data) {
        if (doc._id === id) {
          return doc;
        }
      }
    }).filter(doc => filter(doc));

    if (query.fields) {
      if (Array.isArray(query.fields)) {
        return {
          docs: documents.map((0, _createFieldsMap.default)(query.fields))
        };
      } else {
        throw 'The "fields" field of query must be an array of strings!';
      }
    } else {
      return {
        docs: documents
      };
    }
  };
};

var _default = createMangoFind;
exports.default = _default;