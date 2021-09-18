const environment = require('../build/testing/testEnvironment').testEnvironment("255bdcd1c6ad22db9a07222b7db8b6c1");
require = environment.require;
const emit = environment.emit//original


function map(doc){
    emit([doc.owner,doc.parent] , {type:doc.type,name:doc.name});
}


module.exports = { map };