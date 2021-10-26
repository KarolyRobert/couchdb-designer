import {getTestContext} from '../../../build/testing/testEnvironment';
import { emitted } from '../testBuiltIns';
import { validateViewOptions } from './viewUtils';
import reduceView from './reducers/reduceView';


const createTestViewFunction = (contextId,viewName,context) => {
    return (opts,partition) => {
        let {database} = getTestContext(contextId);
        if(context.views[viewName].map){
            let options = validateViewOptions(Boolean(context.views[viewName].reduce),opts);
            let viewResult;
            if((partition && context.options && context.options.partitioned) || (partition && !context.options)){
                database.data.filter(doc => {
                    return partition === doc._id.split(':')[0];
                }).forEach(pdoc => context.views[viewName].map(pdoc));
            }else{
                if(partition){
                    throw({error:"query_parse_error",reason:"`partition` parameter is not supported in this design doc"});
                }else{
                    if((context.options && context.options.partitioned) || (database.partitioned && !context.options)){
                        throw({error:"query_parse_error",reason:"`partition` parameter is mandatory for queries to this view."});
                    }   
                    database.data.forEach(doc => context.views[viewName].map(doc));
                }
            }
            viewResult = emitted(contextId);
         
            if(options.reduce){
                return reduceView(viewResult,options,context,viewName);
            }else{
                return viewResult;    
            }
        }else{
            throw(`Missing map function in ${context.id}/views/${viewName}!`);
        }
    }
}

export default createTestViewFunction;