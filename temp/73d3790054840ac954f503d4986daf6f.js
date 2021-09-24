const environment = require('../build/testing/testEnvironment').testEnvironment("ad56076cdd3fb5c9b83d976fecfcb1b4");
require = environment.require;
const emit = environment.emit;
const log = environment.log;
const isArray = Array.isArray;
const sum = environment.sum;
const toJSON = environment.toJSON;
//Original content 


function testUpdate(doc,req){
    if (!doc){
        if ('id' in req && req['id']){
            // create new document
            return [{'_id': req['id']}, 'New World']
        }
        // change nothing in database
        return [null, 'Empty World']
    }
    doc['world'] = 'hello';
    doc['edited_by'] = req['userCtx']['name']
    return [doc, 'Edited World!']
}


function otherUpdate(doc,req){
    if (!doc){
        if ('id' in req && req['id']){
            // create new document
            return [{'_id': req['id']}, 'New World']
        }
        // change nothing in database
        return [null, 'Empty World']
    }
    doc['otherhelo'] = 'szia';
    doc['edited_by'] = req['userCtx']['name']
    return [doc, 'Edited other World!']
}

module.exports = { testUpdate, otherUpdate }
