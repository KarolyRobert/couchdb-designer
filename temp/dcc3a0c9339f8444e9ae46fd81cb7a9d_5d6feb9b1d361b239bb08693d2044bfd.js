const environment = require('../build/testing/testEnvironment').testEnvironment("dcc3a0c9339f8444e9ae46fd81cb7a9d");
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
    doc.updateByUpdateFromDir = probalib();
    return [doc,req];
}

module.exports = { updateFromDir }
