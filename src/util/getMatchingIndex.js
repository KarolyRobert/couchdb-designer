import compareAny from './compareAny';
import mangoSort from './mangoSort';
import getSelectorBase from './getSelectorBase';


const getMachingIndex = (indexes,query,partition) => {
    let {sort,selector,use_index} = query;
    let sortArray = sort ? mangoSort(sort) : [];
    let selectorBase = getSelectorBase(selector);
    let matchingIndexes = indexes.filter(index => {
        if(compareAny(sortArray,index.def.fields) === 0){
            if(partition){
                return index.partitioned;
            }else{
                return !index.partitioned;
            }
        }else{
            let result = true;
            for(let field of index.def.fields){
                let key = Object.keys(field)[0];
                if(!selectorBase.includes(key)){
                    result = false;
                    break;
                }
            }
            if(result){
                if(partition){
                    return index.partitioned;
                }else{
                    return !index.partitioned;
                }
            }
            return result;
        }
    }).sort((a,b) => {
        let fieldCountDifferent = a.def.field.length - b.def.field.length;
        if(fieldCountDifferent === 0){
            return compareAny(a.name,b.name);
        }else{
            return fieldCountDifferent;
        }
    });

    let related;
    if(use_index){
        related = matchingIndexes.filter(index => {
            if(typeof use_index === 'string'){
                return index.ddoc.split('/')[1] === use_index;
            }else if(Array.isArray(use_index)){
                return index.ddoc.split('/')[1] === use_index[0] && index.name === use_index[1];
            }else{
                throw('Invalid use_index! use_index must be a string or a two element array of strings!');
            }
        })
        if(!related.length){
            throw('The given use_index is not exist or not match to your query!');
        }
    }else{
        related = matchingIndexes.filter(index => index.def.partial_filter_selector === undefined);
    }
    if(related.length){
        return related[0];
    }
    if(query.sort){
        throw('(no_usable_index) No index exists for this sort, try indexing by the sort fields.');
    }else{
        return indexes[0]; // _all_docs
    }
}

export default getMachingIndex;