"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _testEnvironment = require("../../../build/testing/testEnvironment");

var _updateDocument = require("../changes/updateDocument");

var _supplementRequest = _interopRequireDefault(require("../../util/supplementRequest"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getDocument = (database, id) => {
  let doc = false;

  if (id) {
    for (let document of database) {
      if (id === document._id) {
        doc = { ...document
        };
      }
    }
  }

  return doc;
};

const createTestUpdateFunction = (contextId, updateName, context) => {
  return (req, id) => {
    try {
      if (typeof req === 'object') {
        let {
          database
        } = (0, _testEnvironment.getTestContext)(contextId);
        let request = (0, _supplementRequest.default)(req, id, contextId, `${database.name}/${context.id}/_updates/${updateName}`, true);
        let oldDoc = getDocument(database.data, id);
        let result = context.updates[updateName](oldDoc ? { ...oldDoc
        } : undefined, request);

        if (result && Array.isArray(result) && result.length === 2) {
          let newDoc = result[0];

          if (newDoc === null) {
            return result[1];
          } else if (typeof newDoc === 'object' && newDoc._id) {
            (0, _updateDocument.update)(contextId, newDoc, request.userCtx);
            return result[1];
          } else {
            return `An update function result's first element must be null or object but this is ${newDoc}!`;
          }
        } else {
          return `An update function must return a two element array! update.${updateName} result is ${result}`;
        }
      } else {
        return `Missing request parameter in calling update.${updateName}!`;
      }
    } catch (error) {
      return error;
    }
  };
};

var _default = createTestUpdateFunction;
exports.default = _default;