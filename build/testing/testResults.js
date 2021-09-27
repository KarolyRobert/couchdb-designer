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

module.exports = {
  emitted,
  logged
};