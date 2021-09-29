"use strict";

var _viewSort = _interopRequireDefault(require("./views/viewSort"));

var _testEnvironment = require("../../build/testing/testEnvironment");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const emitted = contextName => {
  let buildIns = (0, _testEnvironment.getTestContext)(contextName).buildIns;
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

const logged = contextName => {
  let buildIns = (0, _testEnvironment.getTestContext)(contextName).buildIns;
  let log = "";
  buildIns.environmentLog.mock.calls.forEach(params => {
    log += `[info] Log :: ${params[0]}\n`;
  });
  buildIns.environmentLog.mockClear();
  return log;
};

const getRow = contextName => {
  return (0, _testEnvironment.getTestContext)(contextName).buildIns.contextedGetRow;
};

const provides = contextName => {
  return (0, _testEnvironment.getTestContext)(contextName).buildIns.contextedProvides;
};

const registerType = contextName => {
  return (0, _testEnvironment.getTestContext)(contextName).buildIns.contextedRegisterType;
};

const start = contextName => {
  return (0, _testEnvironment.getTestContext)(contextName).buildIns.contextedStart;
};

const send = contextName => {
  return (0, _testEnvironment.getTestContext)(contextName).buildIns.contextedSend;
};

const index = contextName => {
  return (0, _testEnvironment.getTestContext)(contextName).buildIns.contextedIndex;
};

const server = contextName => {
  return (0, _testEnvironment.getTestContext)(contextName).server;
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
  server
};