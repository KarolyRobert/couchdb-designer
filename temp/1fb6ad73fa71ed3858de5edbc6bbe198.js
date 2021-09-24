const environment = require('../build/testing/testEnvironment').testEnvironment("ad56076cdd3fb5c9b83d976fecfcb1b4");
require = environment.require;
const emit = environment.emit;
const log = environment.log;
const isArray = Array.isArray;
const sum = environment.sum;
const toJSON = environment.toJSON;
//Original content 

function map(doc){
    log('log from views/byName/map');
    if(doc.name){
        emit(doc.name,1);
    }
}

module.exports = { map }
