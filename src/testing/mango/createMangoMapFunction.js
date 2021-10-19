import {testEnvironment,getTestContext} from '../../../build/testing/testEnvironment';



const createMangoMapFunction = (fields,filter,contextId) => {
    let emit;
    let context = getTestContext(contextId);
    if(context){
        emit = context.buildIns.contextedEmit;
    }else{
        testEnvironment(contextId);
        emit = getTestContext(contextId).buildIns.contextedEmit;
    }
    let fieldKeys  = Object.keys(fields).map(key => key.split('.'));
    return doc => {
        let result = [];
        let isRelevant = true;
        let currentField = doc;
        for(let fieldKey of fieldKeys){
            for(let field of fieldKey){
                if(field in currentField){
                    currentField = currentField[field];
                }else{
                    isRelevant = false;
                    break;
                }
            }
            if(isRelevant){
                result.push(currentField);
            }else{
                break;
            }
        }
        if(isRelevant && filter(doc)){
            emit(doc,result,null);
        }
    }
}

export default createMangoMapFunction;