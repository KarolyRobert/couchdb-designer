"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _testEnvironment = require("../../../build/testing/testEnvironment");

const createMangoMapFunction = (fields, filter, contextId) => {
  let emit;
  let context = (0, _testEnvironment.getTestContext)(contextId);

  if (context) {
    emit = context.buildIns.contextedEmit;
  } else {
    (0, _testEnvironment.testEnvironment)(contextId);
    emit = (0, _testEnvironment.getTestContext)(contextId).buildIns.contextedEmit;
  }

  let fieldKeys = Object.keys(fields).map(key => key.split('.'));
  return doc => {
    let result = [];
    let isRelevant = true;
    let currentField = doc;

    for (let fieldKey of fieldKeys) {
      for (let field of fieldKey) {
        if (field in currentField) {
          currentField = currentField[field];
        } else {
          isRelevant = false;
          break;
        }
      }

      if (isRelevant) {
        result.push(currentField);
      } else {
        break;
      }
    }

    if (isRelevant && filter(doc)) {
      emit(doc, result, null);
    }
  };
};

var _default = createMangoMapFunction;
exports.default = _default;