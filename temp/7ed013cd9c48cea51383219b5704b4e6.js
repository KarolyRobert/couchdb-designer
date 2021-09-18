const environment = require('../build/testing/testEnvironment').testEnvironment("e8a285790e3eb51fc6a7e198b57fd5ea");
require = environment.require;
const emit = environment.emit//original


module.exports.libfunction = function (){
   return 'libfunction call updated';
   // https://docs.couchdb.org/en/stable/query-server/javascript.html?highlight=commonJS%20modules#commonjs-modules
}