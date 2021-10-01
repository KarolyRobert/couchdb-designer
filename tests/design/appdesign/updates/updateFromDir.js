


function updateFromDir(doc,req){
    log('log from updateFromDir');
    var probalib = require('lib/couchdb').libfunction;
    doc.updateByUpdateFromDir = probalib();
    return [doc,req];
}

module.exports = { updateFromDir }