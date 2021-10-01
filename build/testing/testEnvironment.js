"use strict";

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

const registerContext = (contextId, testContext, testDatabase, secObj, userCtx) => {
  if (testDatabase.database !== undefined && !Array.isArray(testDatabase.database)) {
    throw 'createTestContext second parameter must be an array of document object to represent the data of testing database or an array of arrays of document object for represent the nodes of the test database!';
  }

  if (secObj === undefined) {
    secObj = {
      members: {
        roles: ["_admin"]
      },
      admins: {
        roles: ["_admin"]
      }
    };
  }

  if (userCtx === undefined) {
    userCtx = {
      db: 'testdatabase',
      name: null,
      roles: ["_admin"]
    };
  }

  contexts[contextId] = Object.assign(contexts[contextId], {
    context: testContext,
    database: testDatabase,
    secObj,
    userCtx
  });
};

const getTestContext = contextId => {
  return contexts[contextId];
};

const testEnvironment = contextId => {
  if (contexts[contextId]) {
    return contexts[contextId].environment;
  } else {
    const environmentRequire = jest.fn();
    const environmentEmit = jest.fn();
    const environmentLog = jest.fn();
    const environmentGetRow = jest.fn();
    const environmentProvides = jest.fn();
    const environmentRegisterType = jest.fn();
    const environmentStart = jest.fn();
    const environmentSend = jest.fn();
    const environmentIndex = jest.fn();
    const contextedGetRow = jest.fn();
    const contextedProvides = jest.fn();
    const contextedRegisterType = jest.fn();
    const contextedStart = jest.fn();
    const contextedSend = jest.fn();
    const contextedIndex = jest.fn();
    const contextedEmit = jest.fn();

    const contextedRequire = requirePath => {
      let pathSegments = requirePath.split('/');
      let required = contexts[contextId].context;

      for (let segment of pathSegments) {
        if (segment in required) {
          required = required[segment];
        } else {
          throw `Invalid require ${requirePath} is not in the environment ${contexts[contextId].context.id}`;
        }
      }

      if (required.__sourceProperties__ && required.__sourceProperties__.isLib) {
        return required;
      }

      throw `Invalid require ${requirePath}. You can only import which declared by "name.lib.js" rule as a library.`;
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
      server: {}
    };
    return contexts[contextId].environment;
  }
};

module.exports = {
  registerContext,
  testEnvironment,
  getTestContext
};