"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createMangoMap = _interopRequireDefault(require("./createMangoMap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createMangoIndex = (index, indexName, contextProps) => {
  let view = {
    [indexName]: {}
  };
  view[indexName].map = (0, _createMangoMap.default)(index, indexName, contextProps);
  view[indexName].reduce = '_count';
  view[indexName].options = {
    def: index
  };
  return view;
};

var _default = createMangoIndex;
exports.default = _default;