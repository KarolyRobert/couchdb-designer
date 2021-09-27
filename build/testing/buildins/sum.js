"use strict";

const sum = values => {
  let result;
  let elementType = Array.isArray(values[0]) ? 'array' : typeof values[0];

  for (let element of values) {
    if (elementType === 'number') {}
  }
};