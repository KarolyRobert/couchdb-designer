"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const typerError = 'The _sum function requires that map values be numbers, arrays of numbers, or objects. Objects cannot be mixed with other data structures. Objects can be arbitrarily nested, provided that the values for all fields are themselves numbers, arrays of numbers, or objects.';

const numberArrayReducer = (p, c) => {
  if (Array.isArray(p)) {
    for (let i of p) {
      if (typeof i !== 'number') {
        throw new Error(typerError);
      }
    }
  } else if (typeof p !== 'number') {
    throw new Error(typerError);
  }

  if (Array.isArray(c)) {
    for (let i of c) {
      if (typeof i !== 'number') {
        throw new Error(typerError);
      }
    }
  } else if (typeof c !== 'number') {
    throw new Error(typerError);
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
              throw new Error(typerError);
            }
          }

          return element[key];
        }));
      }

      return result;
  }
};

const _sum = (keys, values, rereduce) => {
  return {
    key: null,
    value: sum(values)
  };
};

var _default = _sum;
exports.default = _default;