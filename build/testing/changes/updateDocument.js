"use strict";

var _crypto = _interopRequireDefault(require("crypto"));

var _testEnvironment = require("../../../build/testing/testEnvironment");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getDocIndex = (database, doc) => {
  let docIndex = -1;
  database.forEach((document, index) => {
    if (doc._id === document._id) {
      docIndex = index;
    }
  });
  return docIndex;
};

const validate = (contextId, userCtx, newDoc, oldDoc) => {
  let {
    validators,
    secObj
  } = (0, _testEnvironment.getTestContext)(contextId);

  for (let validator of validators) {
    try {
      validator.validator({ ...newDoc
      }, oldDoc ? { ...oldDoc
      } : null, { ...userCtx
      }, { ...secObj
      });
    } catch (validatorError) {
      throw {
        validatorError: {
          source: validator.parentName,
          error: validatorError
        }
      };
    }
  }
};

const applyChange = (contextId, change) => {
  let context = (0, _testEnvironment.getTestContext)(contextId);
  context.changes = context.changes.filter(seq => seq.id !== change.id);

  let seqHash = _crypto.default.createHash('md5').update(`update_sequence-${change.revision}`).digest('base64');

  let sequence = `${context.update_seq}-${seqHash}`;
  context.changes.push({
    seq: sequence,
    id: change.id,
    chagnes: [{
      rev: change.revision
    }]
  });
  context.update_seq++;
};

const update = (contextId, doc, user) => {
  let {
    database,
    update_seq
  } = (0, _testEnvironment.getTestContext)(contextId);

  if (database.partitioned) {
    //{"error":"illegal_docid","reason":"Doc id must be of form partition:id"}
    let idParts = doc._id.split(':');

    if (idParts.length !== 2) {
      throw {
        error: "illegal_docid",
        reason: "Doc id must be of form partition:id"
      };
    }
  }

  let docIndex = getDocIndex(database.data, doc);
  let existedDocument = Boolean(docIndex > -1);

  let revisionHash = _crypto.default.createHash('md5').update(`revision-${update_seq}`).digest('hex');

  let revision = existedDocument ? database.data[docIndex]._rev : `1-${revisionHash}`;

  if (existedDocument) {
    if (doc._rev === database.data[docIndex]._rev) {
      validate(contextId, user, doc, database.data[docIndex]);
      let newRevision = parseInt(doc._rev.split('-')[0]) + 1;
      revision = `${newRevision}-${revisionHash}`;
      database.data[docIndex] = { ...doc,
        _rev: revision
      };
      let change = {
        id: doc._id,
        revision
      };
      applyChange(contextId, change);
      return change;
    } else {
      throw {
        error: "conflict",
        reason: "Document update conflict."
      };
    }
  } else {
    validate(contextId, user, doc);
    database.data.push({ ...doc,
      _rev: revision
    });
    let change = {
      id: doc._id,
      revision
    };
    applyChange(contextId, change);
    return change;
  }
};

const registerDatabase = (contextId, testDatabase, userCtx) => {
  if (testDatabase) {
    if (typeof testDatabase !== 'object') {
      throw 'The test database must be an object!';
    }

    let {
      database
    } = (0, _testEnvironment.getTestContext)(contextId);
    database.name = testDatabase.name ? testDatabase.name : 'testdatabase';
    database.partitioned = testDatabase.partitioned ? testDatabase.partitioned : false;

    if (testDatabase.data && Array.isArray(testDatabase.data) && testDatabase.data.length) {
      for (let doc of testDatabase.data) {
        update(contextId, doc, userCtx);
      }
    } else if (!Array.isArray(testDatabase.data)) {
      throw 'The data field of test database must be an array of object representing the documents of database!';
    }
  }
};

module.exports = {
  update,
  registerDatabase
};