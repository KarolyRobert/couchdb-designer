"use strict";

var _viewUtils = require("../viewUtils");

const typerError = 'The _sum function requires that map values be numbers, arrays of numbers, or objects. Objects cannot be mixed with other data structures. Objects can be arbitrarily nested, provided that the values for all fields are themselves numbers, arrays of numbers, or objects.';

const numberArrayReducer = (p, c) => {
  if (Array.isArray(p)) {
    for (let i of p) {
      if (typeof i !== 'number') {
        throw typerError;
      }
    }
  } else if (typeof p !== 'number') {
    throw typerError;
  }

  if (Array.isArray(c)) {
    for (let i of c) {
      if (typeof i !== 'number') {
        throw typerError;
      }
    }
  } else if (typeof c !== 'number') {
    throw typerError;
  }

  if (c.length) {
    let result = [];
    let index = 0;

    if (p.length) {
      while (p.length > index && c.length > index) {
        result[index] = p[index] + c[index];
        index++;
      }

      if (p.length > index) {
        while (p.length > index) {
          result[index] = p[index];
          index++;
        }

        return result;
      } else {
        while (c.length > index) {
          result[index] = c[index];
          index++;
        }

        return result;
      }
    } else {
      c[0] += p;
      return c;
    }
  } else {
    if (p.length) {
      p[0] += c;
      return p;
    } else {
      return p + c;
    }
  }
};

const sum = values => {
  let elementType = Array.isArray(values[0]) ? 'array' : typeof values[0];

  switch (elementType) {
    case 'number':
    case 'array':
      return values.reduce(numberArrayReducer);

    case 'object':
      let result = {};
      let keys = Object.keys(values[0]);

      for (let key of keys) {
        result[key] = sum(values.map(element => {
          for (let currentKey in element) {
            if (!keys.includes(currentKey)) {
              throw typerError;
            }
          }

          return element[key];
        }));
      }

      return result;
  }
};

const _sum = (keys, values, rereduce) => {
  return sum(values);
};

const _count = (keys, values, rereduce) => {
  if (rereduce) {
    return sum(values);
  } else {
    return values.length;
  }
};

const _approx_count_distinct = (keys, values, rereduce) => {
  if (rereduce) {
    return values[0];
  } else {
    let result = 0;
    let currentKey;

    for (let key of keys) {
      if (!(0, _viewUtils.jokerEquals)(currentKey, key[1])) {
        result++;
        currentKey = key[1];
      }
    }

    return result;
  }
};

const _stats = (keys, values, rereduce) => {
  if (rereduce) {
    return {
      'sum': values.reduce(function (a, b) {
        return a + b.sum;
      }, 0),
      'min': values.reduce(function (a, b) {
        return Math.min(a, b.min);
      }, Infinity),
      'max': values.reduce(function (a, b) {
        return Math.max(a, b.max);
      }, -Infinity),
      'count': values.reduce(function (a, b) {
        return a + b.count;
      }, 0),
      'sumsqr': values.reduce(function (a, b) {
        return a + b.sumsqr;
      }, 0)
    };
  } else {
    return {
      'sum': sum(values),
      'min': Math.min.apply(null, values),
      'max': Math.max.apply(null, values),
      'count': values.length,
      'sumsqr': function () {
        var sumsqr = 0;
        values.forEach(function (value) {
          sumsqr += value * value;
        });
        return sumsqr;
      }()
    };
  }
};

module.exports = {
  _sum,
  _count,
  _stats,
  _approx_count_distinct
};