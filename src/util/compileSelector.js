
const selectorTypes = {
    "$lt": "any",
    "$gt": "any",
    "$lte": "any",
    "$gte": "any",
    "$eq": "any",
    "$ne": "any",
    "$exists": "boolean",
    "$type": "type",
    "$in" : "array",
    "$nin" : "array",
    "$size" : "integer",
    "$mod" : "mod",
    "$regex": "regex",
    "$and" : "selectors",
    "$or": "selectors",
    "$not": "selector",
    "$nor": "selectors",
    "$all": "array",
    "$elemMatch": "selector",
    "$allMatch": "selector",
    "$keyMapMatch": "selector",
}

const getValidArgument = selectorKey => {
    if(selectorKey in selectorTypes) {
        return selectorTypes[selectorKey];
    }else{
        throw('invalid selector');
    }
}

const compileSelector = (selector,file,index, selectorKey = false) => {
    if(selectorKey) {
        let selectorType = selector === null ? 'null' : Array.isArray(selector) ? 'array' : typeof selector;
        if(selectorKey.startsWith('$')){
            let argumentType = getValidArgument(selectorKey);
            switch(argumentType){
                case 'any':
                    return selector;
                case 'boolean':
                case 'array':
                    if(selectorType === argumentType){
                        return selector;
                    }else{
                        throw(`${selectorKey}'s argument must be ${argumentType}! You can fix it in ${file} / ${index}`);
                    }
                case 'integer':
                    if(Number.isInteger(selector)){
                        return selector;
                    }else{
                        throw(`${selectorKey}'s argument must be ${argumentType}! You can fix it in ${file} / ${index}`);
                    }
                case 'regex':
                    if(selectorType === 'string'){
                        return selector;
                    }else{
                        throw(`${selectorKey}'s argument must be a regular expression! You can fix it in ${file} / ${index}`);
                    }
                case 'type':
                    if(['null','boolean','number','string','array','object'].includes(selector)){
                        return selector;
                    }else{
                        throw(`${selectorKey}'s argument must be one of the null,boolean,number,string,array,object values! You can fix it in ${file} / ${index}`);
                    }
                case 'mod':
                    if(selectorType === 'array' && selector.length === 2 && Number.isInteger(selector[0]) && Number.isInteger(selector[1])){
                        return selector;
                    }else{
                        throw('$mod argument must be an two element array of integers! You can fix it in ${file} / ${index}');
                    }
                case 'selector':
                    if(selectorType === 'object'){
                        return compileSelector(selector,file,index);
                    }else{
                        throw(`${selectorKey}'s argument must be ${argumentType}! You can fix it in ${file} / ${index}`);
                    }
                case 'selectors':
                    if(selectorType === 'array'){
                        let selectorArray = [];
                        for(let partSelector of selector){
                            try{
                            selectorArray.push(compileSelector(partSelector,file,index));
                            }catch(err){
                                throw(`${selectorKey}'s argument must be an array of selectors! You can fix it in ${file} / ${index}`);
                            }
                        }
                        return selectorArray;
                    }else{
                        throw(`${selectorKey}'s argument must be an array of selectors! You can fix it in ${file} / ${index}`);
                    }

            }
        }else{
            if(selectorType === 'array' || selectorType === 'string' || selectorType === 'number'|| selectorType === 'boolean' || selectorType === 'null'){
                return {"$eq":selector};
            }else{
                if(Object.keys(selector).length){
                    return compileSelector(selector,file,index);
                }else{
                    return {"$eq":selector};
                }
            }
        }
    }else if(typeof selector === 'object') {
        let compiledSelector = {};
        let keys = Object.keys(selector);
        if(keys.length > 1){
            let andSelector = []
            for(let key of keys){
                andSelector.push({[key]:compileSelector(selector[key],file,index,key)});
            }
            compiledSelector['$and'] = andSelector;
        }else if (keys.length === 1){
            compiledSelector[keys[0]] = compileSelector(selector[keys[0]],file,index,keys[0]);
        }
        return compiledSelector;
    }else{
        throw('The selector must be an object! You can fix it in ${file} / ${index}');
    }
}

export default compileSelector;