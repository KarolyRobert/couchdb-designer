import {jokerEquals} from './viewUtils';


const groupViewResult = (rows,level) => {
    let result = [];
    let index = -1;
    let currentKey;
    let newGroup = false;
    rows.forEach(record => {
        if(Array.isArray(record.key)){
            if(!Array.isArray(currentKey)){
                currentKey = [];
                newGroup = true;
            }
            if(level === 'max'){
                if(!jokerEquals(currentKey,record.key)){
                    currentKey = record.key;
                    newGroup = true;
                }
            }else{
                let Key = record.key.filter((_,index) => index < level);
                for(let kindex in Key){
                    if(!jokerEquals(currentKey[kindex],Key[kindex])){
                        newGroup = true;
                        currentKey[kindex] = Key[kindex];
                    }
                }
            }
            if(newGroup){
                index++;
                result.push([]);
            }
            result[index].push(record);
            newGroup = false;
        }else{
            if(!jokerEquals(currentKey,record.key)){
                currentKey = record.key;
                newGroup = true;
            }
            if(newGroup){
                index++;
                result.push([]);
            }
            result[index].push(record);
            newGroup = false;
        }
    });
    return result;
}

export default groupViewResult;