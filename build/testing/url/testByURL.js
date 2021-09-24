"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createViewResult = _interopRequireDefault(require("./createViewResult"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const testByUrl = (context, testData, url) => {
  let query = new URL(`http://${url}`);

  switch (query.host) {
    case '_view':
      return (0, _createViewResult.default)(context, testData, query.pathname.substr(1), query.searchParams);

    default:
      throw new Error(`The ${query.host} url is not supported yet! Please write an issue if you need this type of testing.`);
  }

  return {};
};

var _default = testByUrl;
exports.default = _default;