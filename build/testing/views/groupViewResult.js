"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _viewUtils = require("./viewUtils");

const groupViewResult = (rows, level) => {
  let result = [];
  let index = -1;
  let currentKey;
  let newGroup = false;
  rows.forEach(record => {
    if (Array.isArray(record.key)) {
      if (!Array.isArray(currentKey)) {
        currentKey = [];
        newGroup = true;
      }

      if (level === 'max') {
        if (!(0, _viewUtils.jokerEquals)(currentKey, record.key)) {
          currentKey = record.key;
          newGroup = true;
        }
      } else {
        let Key = record.key.filter((_, index) => index < level);

        for (let kindex in Key) {
          if (!(0, _viewUtils.jokerEquals)(currentKey[kindex], Key[kindex])) {
            newGroup = true;
            currentKey[kindex] = Key[kindex];
          }
        }
      }

      if (newGroup) {
        index++;
        result.push([]);
      }

      result[index].push(record);
      newGroup = false;
    } else {
      if (!(0, _viewUtils.jokerEquals)(currentKey, record.key)) {
        currentKey = record.key;
        newGroup = true;
      }

      if (newGroup) {
        index++;
        result.push([]);
      }

      result[index].push(record);
      newGroup = false;
    }
  });
  return result;
};

var _default = groupViewResult;
exports.default = _default;