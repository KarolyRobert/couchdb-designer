
const byArray = (a,b) => {
    let index = 0;
    let relation = 0;//joker(a[index],b[index]);
    while(relation === 0 && a.length > index && b.length > index){
        relation = joker(a[index],b[index]);
        index++;
    }
    if(relation === 0){
      return a.length - b.length;
    }else{
      return relation;
    }
  }
  
  const byObject = (a,b) => {
    let index = 0
    let aKeys = Object.keys(a);
    let bKeys = Object.keys(b);
    let keyRelation = 0;
    let valueRelation = 0;
    while(keyRelation === 0 && valueRelation === 0 && aKeys.length > index && bKeys.length > index){
      keyRelation = joker(aKeys[index],bKeys[index]);
      valueRelation = joker(a[aKeys[index]],b[bKeys[index]]);
      index++;
    }
    if(keyRelation === 0 && valueRelation === 0){
      return aKeys.length - bKeys.length;
    }else{
      if(keyRelation === 0){
        return valueRelation;
      }else{
        return keyRelation;
      }
    }
  }
  
  const joker = (a,b) => {
    let aType = a === null ? 'null' : Array.isArray(a) ? 'array' : typeof a;
    let bType = b === null ? 'null' : Array.isArray(b) ? 'array' : typeof b;
    let sortType = aType+bType;
    switch(sortType){
      case 'nullnull':
          return 0;
      case 'nullboolean':
      case 'nullnumber':
      case 'nullstring':
      case 'nullarray':
      case 'nullobject':
          return -1;
      case 'booleannull':
          return 1;
      case 'booleanboolean':
          if(a === b){
            return 0;
          }else if(a){
            return 1;
          }else{
            return -1;
          }
      case 'booleannumber':
      case 'booleanstring':
      case 'booleanarray':
      case 'booleanobject':
        return -1;
      case 'numbernull':
      case 'numberboolean':
        return 1;
      case 'numbernumber':
        return a-b;
      case 'numberstring':
      case 'numberarray':
      case 'numberobject':
        return -1;
      case 'stringnull':
      case 'stringboolean':
      case 'stringnumber':
        return 1;
      case 'stringstring':
        if(a === b){
          return 0;
        }
        if(a > b){
          return 1;
        }else{
          return -1;
        }
      case 'stringarray':
      case 'stringobject':
        return -1;
      case 'arraynull':
      case 'arrayboolean':
      case 'arraynumber':
      case 'arraystring':
        return 1;
      case 'arrayarray':
        return byArray(a,b);
      case 'arrayobject':
        return -1;
      case 'objectnull':
      case 'objectboolean':
      case 'objectnumber':
      case 'objectstring':
      case 'objectarray':
        return 1;
      case 'objectobject':
        return byObject(a,b);
    }
  }

const viewSort = (a,b) => joker(a.key, b.key);


export default viewSort;