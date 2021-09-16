


function updateFomDir(doc,req){
    if (!doc){
        if ('id' in req && req['id']){
            // create new document
            return [{'_id': req['id']}, 'New World']
        }
        // change nothing in database
        return [null, 'Empty World']
    }
    doc['fromdir'] = 'szia';
    doc['edited_by'] = req['userCtx']['name']
    return [doc, 'Edited World from dir']
}

module.exports = { updateFomDir }