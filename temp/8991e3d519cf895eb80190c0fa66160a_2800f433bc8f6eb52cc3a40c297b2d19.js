const environment = require('../build/testing/testEnvironment').testEnvironment("8991e3d519cf895eb80190c0fa66160a");
require = environment.require;
const emit = environment.emit;
const log = environment.log;
const isArray = Array.isArray;
const sum = environment.sum;
const toJSON = JSON.stringify;
const getRow = environment.getRow;
const provides = environment.provides;
const registerType = environment.registerType;
const start = environment.start;
const send = environment.send;
const index = environment.index;
//Original content 



function map(doc) {
    var row = getRow();
}

module.exports = {map};
