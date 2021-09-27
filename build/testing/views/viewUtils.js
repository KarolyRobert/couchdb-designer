"use strict";

const jokerEquals = (a, b) => {
  let aType = a === null ? 'null' : Array.isArray(a) ? 'array' : typeof a;
  let bType = b === null ? 'null' : Array.isArray(b) ? 'array' : typeof b;

  if (aType === bType) {
    switch (aType) {
      case 'undefined':
      case 'null':
        return true;

      case 'boolean':
      case 'number':
      case 'string':
        return a === b;

      case 'array':
        return a.length === b.length && a.every((value, index) => jokerEquals(value, b[index]));

      case 'object':
        let aKeys = Object.keys(a);
        let bKeys = Object.keys(b);
        return aKeys.every((key, index) => key === bKeys[index]) && aKeys.every(key => jokerEquals(a[key], b[key]));
    }
  } else {
    return false;
  }
};

const validateViewOptions = (hasReduce, options = {}) => {
  let reduce = hasReduce ? options.reduce === undefined ? true : options.reduce : options.reduce !== undefined ? options.reduce ? 'invalid' : false : false;

  if (reduce === 'invalid') {
    throw 'Missing reduce function!';
  }

  let group_level = options.group_level === undefined ? 0 : options.group_level;
  let group = options.group === undefined ? false || group_level > 0 : options.group;

  if (!reduce && group) {
    throw 'Invalid use of grouping on a map view.';
  }

  if (!group && group_level > 0) {
    throw "Can't specify group=false and group_level>0 at the same time";
  }

  if (group && group_level === 0) {
    group_level = 'max';
  }

  return {
    reduce,
    group,
    group_level
  };
};

module.exports = {
  validateViewOptions,
  jokerEquals
};