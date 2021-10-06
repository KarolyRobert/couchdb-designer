"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _testEnvironment = require("../../build/testing/testEnvironment");

var _getBuiltInPolicy = _interopRequireDefault(require("../util/getBuiltInPolicy"));

var _supplementRequest = _interopRequireDefault(require("../util/supplementRequest"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const callingErrors = {
  Emit: "Calling 'emit' allows only in view's map function!",
  Require: "Calling 'require' from reduce function in is not allowed and useless from library!",
  GetRow: "Calling 'getRow' allows only in list functions!",
  Provides: "Calling 'provides' allows only in list and show functions!",
  RegisterType: "Calling 'registerType' allows only in list and show functions!",
  Start: "Calling 'start' allows only in list functions!",
  Send: "Calling 'send' allows only in list functions!",
  Index: "Calling 'index' allows only in index functions!"
};

const createMockFunction = (fileStats, contextProps, name, designFunction) => {
  let policy = (0, _getBuiltInPolicy.default)(fileStats, contextProps, name);
  const {
    buildIns
  } = (0, _testEnvironment.getTestContext)(contextProps.contextId);
  return jest.fn((...args) => {
    for (let allowed of policy.allowed) {
      if (allowed === 'Emit') {
        buildIns.environmentEmit.mockImplementation((...emitargs) => buildIns.contextedEmit(args[0], ...emitargs));
      } else if (allowed === 'Require') {
        buildIns.environmentRequire.mockImplementation(requirePath => {
          if (policy.allowed.includes('Emit') && requirePath.indexOf('views') !== 0) {
            throw {
              testError: `The map function can only require library from under views section! You can fix it in ${fileStats.filePath}`
            };
          }

          if (contextProps.name) {
            return buildIns.contextedRequire(requirePath, contextProps.name);
          } else {
            return buildIns.contextedRequire(requirePath);
          }
        });
      } else {
        buildIns[`environment${allowed}`].mockImplementation((...builtInArgs) => buildIns[`contexted${allowed}`](...builtInArgs));
      }
    }

    for (let denied of policy.denied) {
      buildIns[`environment${denied}`].mockImplementation(() => {
        throw {
          testError: `${callingErrors[denied]} You can fix it in ${fileStats.filePath}`,
          errorType: denied
        };
      });
    }

    if (policy.uri) {
      args[1] = (0, _supplementRequest.default)(args[1], null, contextProps.contextId, policy.uri);
    }

    let result;

    if (fileStats.isLib) {
      try {
        result = designFunction(...args);
      } catch (err) {
        if (err.testError) {
          throw new Error(`${callingErrors[err.errorType]} You can fix it in ${fileStats.filePath}`);
        } else {
          throw new Error(`Your library ${fileStats.filePath} throw error: ${err.message}`);
        }
      }
    } else {
      try {
        result = designFunction(...args);
      } catch (designError) {
        if (designError.testError) {
          throw designError.testError;
        } else {
          throw `Your function ${name} from ${fileStats.filePath} throw error: ${designError.message}`;
        }
      }
    }

    if (fileStats.isLib) {
      buildIns.environmentRequire.mockImplementation(requirePath => buildIns.contextedRequire(requirePath));
    }

    return result;
  });
};

var _default = createMockFunction;
exports.default = _default;