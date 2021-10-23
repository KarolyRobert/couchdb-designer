import compileSelector from './compileSelector';



const getSelectorBase = (selector,compiled = false) => {
    let compiledSelector = compiled ? selector : compileSelector(selector);
    let selectorKey = Object.keys(compiledSelector)[0];
    if(selectorKey === '$and'){
        let result = [];
        for(let subSelector of compiledSelector['$and']){
            let subSelectorKey = Object.keys(subSelector)[0];
            if(subSelectorKey === '$and'){
                result.concat(getSelectorBase(subSelector,true));
            }else{
                if(subSelectorKey !== '$or' || subSelectorKey !== '$nor'){
                    result.push(subSelectorKey);
                }
            }
        }
        return result;
    }else{
        if(selectorKey === '$or' || selectorKey === '$nor'){
            return [];
        }else{
            return [selectorKey];
        }
    }
}

export default getSelectorBase;