
'use strict';

const promises = jest.createMockFromModule('fs/promises');

promises.readFileSync = jest.fn();
promises.writeFileSync = jest.fn();
promises.readdir = jest.fn();
promises.access = jest.fn();
promises.stat = jest.fn();

module.exports = promises;
