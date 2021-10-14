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
  if (typeof testDatabase !== 'object' || !testDatabase.name || !testDatabase.data || !Array.isArray(testDatabase.data)) {
    throw 'The testdatabase must be an object with at least name and data field, data must be an array and you can specify with partitioned field if your testdatabase is partitioned.';
  }

  if (testDatabase) {
    let {
      database
    } = (0, _testEnvironment.getTestContext)(contextId);
    database.name = testDatabase.name;
    database.partitioned = testDatabase.partitioned ? testDatabase.partitioned : false;

    for (let doc of testDatabase.data) {
      update(contextId, doc, userCtx);
    }
  }
};

module.exports = {
  update,
  registerDatabase
};