

function map (doc){
    var date = new Date(doc.date);
    emit([date.getFullYear(), date.getMonth(), date.getDay(), date.getHours()],doc.value);
}

module.exports = { map }