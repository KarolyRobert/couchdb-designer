
const isReverseIndex = index => {
    let firstField = index.def.fields[0];
    let fieldKey = Object.keys(firstField)[0];
    return firstField[fieldKey] === 'desc';
}

const getMangoIndexRows = (context,index,partition) => {
    let reverse = isReverseIndex(index);
    let rows;
    if(index.ddoc !== null){
        let ddocName = index.ddoc.split('/')[1];
        rows = context.server[ddocName].view[index.name]({reduce:false},partition).rows;
    }else{
        rows = context.server.allDocs(partition).rows;
    }
    if(reverse){
        rows.reverse();
    }
    return rows;
}

export default getMangoIndexRows;