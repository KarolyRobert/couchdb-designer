const environment = require('../build/testing/testEnvironment').testEnvironment("ad56076cdd3fb5c9b83d976fecfcb1b4");
require = environment.require;
const emit = environment.emit;
const log = environment.log;
const isArray = Array.isArray;
const sum = environment.sum;
const toJSON = environment.toJSON;
const getRow = environment.getRow;
const provides = environment.provides;
const registerType = environment.registerType;
const start = environment.start;
const send = environment.send;
//Original content 


function map (doc){
    var date = new Date(doc.date);
    emit([date.getFullYear(), date.getMonth(), date.getDay(), date.getHours()],doc.value);
}

module.exports = { map }
