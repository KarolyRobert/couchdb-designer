


function updateFromDir(doc,req){
    var probalib = require('lib/couchdb').libfunction;
    return [doc,probalib()];
}

module.exports = { updateFromDir }