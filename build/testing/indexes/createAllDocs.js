"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _testEnvironment = require("../../../build/testing/testEnvironment");

var _testBuiltIns = require("../testBuiltIns");

const createAllDocs = contextId => {
  let context = (0, _testEnvironment.getTestContext)(contextId);

  if (!context) {
    (0, _testEnvironment.testEnvironment)(contextId);
    context = (0, _testEnvironment.getTestContext)(contextId);
  }

  let {
    server
  } = context;

  server['allDocs'] = (partition = false) => {
    let {
      database,
      buildIns
    } = (0, _testEnvironment.getTestContext)(contextId);

    const map = doc => {
      buildIns.contextedEmit(doc, doc._id, {
        rev: doc._rev
      });
    };

    if (partition) {
      if (database.partitioned) {
        database.data.filter(doc => {
          return partition === doc._id.split(':')[0];
        }).forEach(pdoc => map(pdoc));
      } else {
        throw {
          error: "bad_request",
          reason: "database is not partitioned"
        };
      }
    } else {
      database.data.forEach(doc => map(doc));
    }

    return (0, _testBuiltIns.emitted)(contextId);
  };
};

var _default = createAllDocs;
exports.default = _default;