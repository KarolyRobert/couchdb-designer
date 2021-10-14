import {getTestContext} from '../../../../build/testing/testEnvironment';
import groupViewResult from '../groupViewResult';
import builtInReducers from './builtInReducers';

const groupKey = (key,level) => {
    if(level === 'max'){
        return key;
    }else{
        if(Array.isArray(key)){
            return key.filter((_,index) => index < level);
        }else{
            return key;
        }
    }
}

const getReducer = reducer => {
    if(typeof reducer === 'function'){
        return reducer;
    }else{
        if(reducer in builtInReducers){
            return builtInReducers[reducer];
        }else{
            throw(`${reducer} is not a built-in reducer in couchdb`);
        }
    }
}

const reduceView = (viewResult,options,contextName,viewName) => {
    let {context} = getTestContext(contextName);
    if(context.options && context.options.partitioned && typeof context.views[viewName].reduce === 'function'){
        throw('Custom reduce function in a partitioned design document is not supported in couchdb!\nUse a builtin reduce function or make the design document global by options.partitioned:false');
    }
    
    let isApprox = context.views[viewName].reduce === '_approx_count_distinct';

    let reduce = getReducer(context.views[viewName].reduce);
   
    if(options.group){
        let groups = groupViewResult(viewResult.rows,options.group_level);
        if(isApprox){
            let resultRows = groups.map(group => {
                return {key:groupKey(group[0].key,options.group_level), value:1}
            })
            return {rows:resultRows};
        }else{
            let reduceRows = groups.map(group => {
                let keys = [];
                let values = [];
                for(let row of group){
                   
                    keys.push([row.id, row.key]);
                    values.push(row.value);
                }
                return {key:groupKey(keys[0][1],options.group_level),value:reduce(keys,values,false)}
            });
            let rereduceRows = reduceRows.map(row => {
                return {key:row.key,value:reduce(null,[row.value],true)}
            });
            return {rows:rereduceRows};
        }
    }else{
        let keys = [];
        let values = [];
        for(let row of viewResult.rows){
            keys.push([row.id, row.key]);
            values.push(row.value);
        }
        let reduced = reduce(keys,values,false);
        return {rows:[{key:null,value:reduce(null,[reduced],true)}]};
    }
    
}

export default reduceView;