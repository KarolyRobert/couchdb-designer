"use strict";

const contexts = {};

const environmentSum = arr => {
  if (Array.isArray(arr)) {
    let result = 0;

    for (let value of arr) {
      if (typeof value === 'number') {
        result += value;
      } else {
        throw new Error('The parameter of "sum()" must be an array of numbers!');
      }
    }

    return result;
  }

  throw new Error('The parameter of "sum()" must be an array of numbers!');
};

const environmentToJSON = p => JSON.stringify(p);

const registerContext = (testContext, testContextName) => {
  contexts[testContextName] = Object.assign(contexts[testContextName], {
    context: testContext
  });
};

const getTestContext = testContextName => {
  return contexts[testContextName];
};

const testEnvironment = contextName => {
  if (contexts[contextName]) {
    return contexts[contextName].environment;
  } else {
    const environmentRequire = jest.fn();
    const environmentEmit = jest.fn();
    const environmentLog = jest.fn();
    const contextedEmit = jest.fn();

    const contextedRequire = requirePath => {
      let pathSegments = requirePath.split('/');
      let required = contexts[contextName].context;

      for (let segment of pathSegments) {
        if (segment in required) {
          required = required[segment];
        } else {
          throw new Error(`Invalid require ${requirePath} is not in the environment ${contexts[contextName].context.id}`);
        }
      }

      if (required.__sourceProperties__ && required.__sourceProperties__.isLib) {
        return required;
      }

      throw new Error(`Invalid require ${requirePath}. You can only import which declared by "name.lib.js" rule as a library.`);
    };

    contexts[contextName] = {
      buildIns: {
        environmentRequire,
        environmentEmit,
        environmentLog,
        contextedEmit,
        contextedRequire
      },
      environment: {
        require: environmentRequire,
        emit: environmentEmit,
        log: environmentLog,
        sum: environmentSum,
        toJSON: environmentToJSON
      }
    };
    return contexts[contextName].environment;
  }
};

module.exports = {
  registerContext,
  testEnvironment,
  getTestContext
};