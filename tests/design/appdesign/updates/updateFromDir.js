


function updateFromDir(doc,req){
    log('log from updateFromDir');
    var probalib = require('lib/couchdb').libfunction;
    return [doc,probalib()];
}

module.exports = { updateFromDir }