const environment = require('../build/testing/testEnvironment').testEnvironment("ad56076cdd3fb5c9b83d976fecfcb1b4");
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



function updateFromDir(doc,req){
    log('log from updateFromDir');
    var probalib = require('lib/couchdb').libfunction;
    return [doc,probalib()];
}

module.exports = { updateFromDir }
