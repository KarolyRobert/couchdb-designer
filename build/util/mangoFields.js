"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = require("util");

const mangoFields = (fields, fileName, indexName) => {
  let fieldsObject = {};
  let direction = false;

  for (let field of fields) {
    if (typeof field === 'string') {
      if (direction && direction !== 'asc') {
        throw `(unsupported_mixed_sort) Sorts currently only support a single direction for all fields. You can fix it in ${fileName} - index: ${indexName}.`;
      } else if (!direction) {
        direction = 'asc';
      }

      fieldsObject[field] = direction;
    } else if (typeof field === 'object') {
      let fieldName = Object.keys(field);

      if (fieldName.length === 1 && (field[fieldName[0]] === 'asc' || field[fieldName[0]] === 'desc')) {
        if (direction && direction !== field[fieldName[0]]) {
          throw `(unsupported_mixed_sort) Sorts currently only support a single direction for all fields. You can fix it in ${fileName} - index: ${indexName}.`;
        } else if (!direction) {
          direction = field[fieldName[0]];
        }

        fieldsObject[fieldName[0]] = direction;
      } else {
        throw `(invalid_sort_field) Invalid sort field: ${(0, _util.inspect)(field)}. You can fix it in ${fileName},${indexName} index.`;
      }
    } else {
      throw `(invalid_sort_field) Invalid sort field: ${field}. You can fix it in ${fileName},${indexName} index.`;
    }
  }

  return fieldsObject;
};

var _default = mangoFields;
exports.default = _default;