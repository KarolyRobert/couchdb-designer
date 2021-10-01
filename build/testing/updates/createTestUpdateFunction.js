"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _testEnvironment = require("../../../build/testing/testEnvironment");

var _supplementRequest = _interopRequireDefault(require("./supplementRequest"));

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

const updateDocument = (database, doc, oldDoc, updateName) => {
  let updateIndex = -1;
  database.forEach((document, index) => {
    if (document._id === doc._id) {
      updateIndex = index;
    }
  });

  if (updateIndex > -1) {
    if (!oldDoc) {
      throw `Your server.update.${updateName} updateFunction try to overwrite an exising document!`;
    } else {
      database[updateIndex] = doc;
    }
  } else {
    database.push(doc);
  }
};

const createTestUpdateFunction = (contextName, updateName, context) => {
  return (req, id) => {
    if (typeof req === 'object') {
      let {
        database
      } = (0, _testEnvironment.getTestContext)(contextName);
      let request = (0, _supplementRequest.default)(req, id, contextName, `testdatabase/${context.id}/_updates/${updateName}`);
      let validators = database._validators;
      let oldDoc = getDocument(database.database, id);
      let result = context.updates[updateName](oldDoc ? { ...oldDoc
      } : undefined, request);

      if (result && Array.isArray(result) && result.length === 2) {
        let newDoc = result[0];

        if (newDoc === null) {
          return result[1];
        } else if (typeof newDoc === 'object') {
          if (newDoc._id && (!oldDoc || oldDoc._id === newDoc._id)) {
            if (validators.length) {
              let validatorErrors = [];

              for (let validator of validators) {
                try {
                  validator.validator({ ...newDoc
                  }, oldDoc ? { ...oldDoc
                  } : undefined, request.userCtx, request.secObj);
                } catch (err) {
                  validatorErrors.push([validator.parentName, err]);
                }
              }

              if (validatorErrors.length) {
                let resultErrors = [];
                let invalidError = false;

                for (let validatorError of validatorErrors) {
                  if (validatorError[1].unauthorized) {
                    resultErrors.push({
                      sourec: validatorError[0],
                      error: {
                        error: 'unauthorized',
                        reason: validatorError.unauthorized
                      }
                    });
                  } else if (validatorError[1].forbidden) {
                    resultErrors.push({
                      sourec: validatorError[0],
                      error: {
                        error: 'forbidden',
                        reason: validatorError.forbidden
                      }
                    });
                  } else {
                    resultErrors.push({
                      sourec: validatorError[0],
                      error: validatorError[1]
                    });
                    invalidError = true;
                  }
                }

                if (invalidError) {
                  throw {
                    message: 'Your validate_doc_update throw invalid error!',
                    error: resultErrors
                  };
                } else if (resultErrors.length) {
                  return resultErrors;
                }
              }
            }

            updateDocument(database.database, newDoc, oldDoc, updateName);
            return result[1];
          } else {
            throw `An update function result's document must has an _id field which is recommended to match to updated doument's _id if it is not a new document!\n Note: The couchdb is allow you to create new document by calling an updateFunction on an exist document.`;
          }
        } else {
          throw `An update function result's first element must be null or object but this is ${newDoc}!`;
        }
      } else {
        throw `An update function must return a two element array! server.update.${updateName} result is ${result}`;
      }
    } else {
      throw `Missing request parameter in calling server.update.${updateName}!`;
    }
  };
};

var _default = createTestUpdateFunction;
exports.default = _default;