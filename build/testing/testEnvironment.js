"use strict";

var _builtInFunction = _interopRequireDefault(require("../builtin/builtInFunction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const contexts = {};

const environmentSum = arr => {
  if (Array.isArray(arr)) {
    let result = 0;

    for (let index in arr) {
      result += arr[index];
    }

    return result;
  }

  throw 'The parameter of "sum()" must be an array!';
};

const addValidator = (contextId, parentName, validator) => {
  contexts[contextId].validators.push({
    parentName,
    validator
  });
};

const registerContext = (contextId, testContext, type, secObj, userCtx) => {
  if (contexts[contextId]) {
    contexts[contextId] = Object.assign(contexts[contextId], {
      context: testContext,
      secObj,
      userCtx,
      database: {
        data: []
      },
      type
    });
  } else {
    throw 'The context have not anything functionality.';
  }
};

const getTestContext = contextId => {
  return contexts[contextId];
};

const hasJest = Boolean(process.env.JEST_WORKER_ID);

const testEnvironment = contextId => {
  if (contexts[contextId]) {
    return contexts[contextId].environment;
  } else {
    const environmentRequire = hasJest ? jest.fn() : (0, _builtInFunction.default)();
    const environmentEmit = hasJest ? jest.fn() : (0, _builtInFunction.default)();
    const environmentLog = hasJest ? jest.fn() : (0, _builtInFunction.default)();
    const environmentGetRow = hasJest ? jest.fn() : (0, _builtInFunction.default)();
    const environmentProvides = hasJest ? jest.fn() : (0, _builtInFunction.default)();
    const environmentRegisterType = hasJest ? jest.fn() : (0, _builtInFunction.default)();
    const environmentStart = hasJest ? jest.fn() : (0, _builtInFunction.default)();
    const environmentSend = hasJest ? jest.fn() : (0, _builtInFunction.default)();
    const environmentIndex = hasJest ? jest.fn() : (0, _builtInFunction.default)();
    const contextedGetRow = hasJest ? jest.fn() : (0, _builtInFunction.default)();
    const contextedProvides = hasJest ? jest.fn() : (0, _builtInFunction.default)();
    const contextedRegisterType = hasJest ? jest.fn() : (0, _builtInFunction.default)();
    const contextedStart = hasJest ? jest.fn() : (0, _builtInFunction.default)();
    const contextedSend = hasJest ? jest.fn() : (0, _builtInFunction.default)();
    const contextedIndex = hasJest ? jest.fn() : (0, _builtInFunction.default)();
    const contextedEmit = hasJest ? jest.fn() : (0, _builtInFunction.default)();

    const contextedRequire = (requirePath, ddocName = false) => {
      let fullPath = ddocName ? `${ddocName}/${requirePath}` : requirePath;
      let pathSegments = fullPath.split('/');
      let required = contexts[contextId].context;

      for (let segment of pathSegments) {
        if (segment in required) {
          required = required[segment];
        } else {
          if (ddocName) {
            throw {
              testError: `Invalid require "${requirePath}" is not in the environment ${contexts[contextId].context[ddocName].id}`
            };
          } else {
            throw {
              testError: `Invalid require "${requirePath}" is not in the environment ${contexts[contextId].context.id}`
            };
          }
        }
      }

      if (required.__sourceProperties__ && required.__sourceProperties__.isLib) {
        return required;
      }

      throw {
        testError: `Invalid require ${requirePath}. You can only import which declared by "name.lib.js" rule as a library.`
      };
    };

    contexts[contextId] = {
      buildIns: {
        environmentRequire,
        environmentEmit,
        environmentLog,
        environmentGetRow,
        environmentProvides,
        environmentRegisterType,
        environmentStart,
        environmentSend,
        environmentIndex,
        contextedEmit,
        contextedRequire,
        contextedGetRow,
        contextedProvides,
        contextedRegisterType,
        contextedStart,
        contextedSend,
        contextedIndex
      },
      environment: {
        require: environmentRequire,
        emit: environmentEmit,
        log: environmentLog,
        sum: environmentSum,
        getRow: environmentGetRow,
        provides: environmentProvides,
        registerType: environmentRegisterType,
        start: environmentStart,
        send: environmentSend,
        index: environmentIndex
      },
      server: {},
      changes: [],
      validators: [],
      indexes: [{
        "ddoc": null,
        "name": "_all_docs",
        "type": "special",
        "def": {
          "fields": [{
            "_id": "asc"
          }]
        }
      }],
      update_seq: 0
    };
    return contexts[contextId].environment;
  }
};

module.exports = {
  registerContext,
  testEnvironment,
  getTestContext,
  addValidator
};