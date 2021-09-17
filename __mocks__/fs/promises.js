
'use strict';

const promises = jest.createMockFromModule('fs/promises');

promises.readFile = jest.fn();
promises.writeFile = jest.fn();
promises.readdir = jest.fn();
promises.access = jest.fn();
promises.stat = jest.fn();

module.exports = promises;
