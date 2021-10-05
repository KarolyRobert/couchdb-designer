"use strict";

var _viewSort = _interopRequireDefault(require("./views/viewSort"));

var _testEnvironment = require("../../build/testing/testEnvironment");

var _filter = _interopRequireDefault(require("./changes/filter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const emitted = contextId => {
  let buildIns = (0, _testEnvironment.getTestContext)(contextId).buildIns;
  let rows = buildIns.contextedEmit.mock.calls.map(params => ({
    id: params[0]._id,
    key: params[1],
    value: params[2]
  }));
  let count = buildIns.contextedEmit.mock.calls.length;

  if (rows.length) {
    rows.sort(_viewSort.default);
  }

  buildIns.contextedEmit.mockClear();
  return {
    total_rows: count,
    offset: 0,
    rows: rows
  };
};

const logged = contextId => {
  let buildIns = (0, _testEnvironment.getTestContext)(contextId).buildIns;
  let log = "";
  buildIns.environmentLog.mock.calls.forEach(params => {
    log += `[info] Log :: ${params[0]}\n`;
  });
  buildIns.environmentLog.mockClear();
  return log;
};

const getRow = contextId => {
  return (0, _testEnvironment.getTestContext)(contextId).buildIns.contextedGetRow;
};

const provides = contextId => {
  return (0, _testEnvironment.getTestContext)(contextId).buildIns.contextedProvides;
};

const registerType = contextId => {
  return (0, _testEnvironment.getTestContext)(contextId).buildIns.contextedRegisterType;
};

const start = contextId => {
  return (0, _testEnvironment.getTestContext)(contextId).buildIns.contextedStart;
};

const send = contextId => {
  return (0, _testEnvironment.getTestContext)(contextId).buildIns.contextedSend;
};

const index = contextId => {
  return (0, _testEnvironment.getTestContext)(contextId).buildIns.contextedIndex;
};

const server = contextId => {
  if ((0, _testEnvironment.getTestContext)(contextId) && (0, _testEnvironment.getTestContext)(contextId).server) {
    return (0, _testEnvironment.getTestContext)(contextId).server;
  }

  return false;
};

const _design = contextId => {
  return (0, _testEnvironment.getTestContext)(contextId).server;
};

const database = (contextId, id) => {
  if (id) {
    let {
      database
    } = (0, _testEnvironment.getTestContext)(contextId);
    let result = {
      error: "not_found",
      reason: "missing"
    };

    for (let doc of database) {
      if (doc._id === id) {
        result = { ...doc
        };
      }
    }

    return result;
  } else {
    return [...(0, _testEnvironment.getTestContext)(contextId).database];
  }
};

const _changes = (contextId, request) => {
  if (request) {
    return (0, _filter.default)(contextId, request);
  } else {
    let {
      changes
    } = (0, _testEnvironment.getTestContext)(contextId);
    return {
      results: [...changes],
      last_seq: changes[changes.length - 1].seq,
      pending: 0
    };
  }
};

module.exports = {
  emitted,
  logged,
  getRow,
  provides,
  registerType,
  start,
  send,
  index,
  server,
  _design,
  database,
  _changes
};