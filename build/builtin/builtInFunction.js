"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const createMock = (calls, mockFunction) => {
  return (...args) => {
    calls.push(args);

    if (typeof mockFunction === 'function') {
      mockFunction(...args);
    }
  };
};

const builtInFunction = mockFunction => {
  const calls = [];
  let mockFn = createMock(calls, mockFunction);

  const mockImplementation = newMockFn => {
    mockFn = createMock(calls, newMockFn);
  };

  const mockClear = () => {
    calls.splice(0, calls.length);
  };

  const mock = (...args) => {
    return mockFn(...args);
  };

  return Object.assign(mock, {
    mockImplementation,
    mockClear,
    mock: {
      calls
    }
  });
};

var _default = builtInFunction;
exports.default = _default;