"use strict";

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

  return {
    reduce,
    group,
    group_level
  };
};

module.exports = {
  validateViewOptions
};