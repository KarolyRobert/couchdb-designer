
function map(doc){
    log('log from views/byName/map');
    if(doc.name){
        emit(doc.name,1);
    }
}

module.exports = { map }