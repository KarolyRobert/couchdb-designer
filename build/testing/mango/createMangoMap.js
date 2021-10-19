"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createMangoMapFunction = _interopRequireDefault(require("./createMangoMapFunction"));

var _createMangoFilter = _interopRequireDefault(require("./createMangoFilter"));

var _mangoFields = _interopRequireDefault(require("../../util/mangoFields"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createMangoMap = (index, indexName, contextProps) => {
  let file = _path.default.join(contextProps.root, contextProps.name);

  let fields = (0, _mangoFields.default)(index.fields, file, indexName);
  let partial_filter = (0, _createMangoFilter.default)(index.partial_filter_selector, file, indexName);
  return (0, _createMangoMapFunction.default)(fields, partial_filter, contextProps.contextId);
};

var _default = createMangoMap;
exports.default = _default;