

function map(doc){
    emit(doc._id,false);
}

module.exports = {map}