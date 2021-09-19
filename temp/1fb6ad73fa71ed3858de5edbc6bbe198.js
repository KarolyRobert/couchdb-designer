const environment = require('../build/testing/testEnvironment').testEnvironment("e8a285790e3eb51fc6a7e198b57fd5ea");
require = environment.require;
const emit = environment.emit;
const log = environment.log;
const isArray = Array.isArray;
const sum = environment.sum;
const toJSON = environment.toJSON;
//Original content 

function map(doc){
    if(doc.name){
        emit(doc.name,1);
    }
}

module.exports = { map }