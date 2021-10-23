"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _compileSelector = _interopRequireDefault(require("./compileSelector"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getSelectorBase = (selector, compiled = false) => {
  let compiledSelector = compiled ? selector : (0, _compileSelector.default)(selector);
  let selectorKey = Object.keys(compiledSelector)[0];

  if (selectorKey === '$and') {
    let result = [];

    for (let subSelector of compiledSelector['$and']) {
      let subSelectorKey = Object.keys(subSelector)[0];

      if (subSelectorKey === '$and') {
        result.concat(getSelectorBase(subSelector, true));
      } else {
        if (subSelectorKey !== '$or' || subSelectorKey !== '$nor') {
          result.push(subSelectorKey);
        }
      }
    }

    return result;
  } else {
    if (selectorKey === '$or' || selectorKey === '$nor') {
      return [];
    } else {
      return [selectorKey];
    }
  }
};

var _default = getSelectorBase;
exports.default = _default;