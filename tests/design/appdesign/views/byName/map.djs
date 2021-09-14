
function(doc){
    if(doc.name){
        emit(doc.name,1);
    }
}