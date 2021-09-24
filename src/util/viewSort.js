
const byNumber = (a,b) => {
    return a-b
}

const byString = (a,b) => {
    if(a === b){
        return 0;
    }
    if(a > b){
        return 1;
    }else{
        return -1;
    }
}
const byObject = (a,b) => {
    return byString(JSON.stringify(a),JSON.stringify(b))
}

const byArray = (a,b) => {
    let index = 0;
    let keyType = Array.isArray(a[index]) ? 'array' : typeof a[index];
    while(joker[keyType](a[index],b[index]) === 0){
        if(a.length > index+1 && b.length > index+1){
            index++;
            keyType = Array.isArray(a[index]) ? 'array' : typeof a[index];
        }else{
            return a.length - b.length;
        }
    }
    return joker[keyType](a[index],b[index]);
}

const joker = {
    number:byNumber,
    string:byString,
    object:byObject,
    array:byArray
}

const viewSort = {
    number:(a,b) => byNumber(a.key,b.key),
    string:(a,b) => byString(a.key,b.key),
    object:(a,b) => byObject(a.key,b.key),
    array:(a,b) => byArray(a.key,b.key)
}

export default viewSort;