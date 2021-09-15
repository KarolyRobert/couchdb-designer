
function map(doc){
    if(doc.name){
        emit(doc.name,1);
    }
}

module.exports = { map }