const environment = require('../build/testing/testEnvironment').testEnvironment("e8a285790e3eb51fc6a7e198b57fd5ea");
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
