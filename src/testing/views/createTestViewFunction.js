import {getTestContext} from '../../../build/testing/testEnvironment';
import { emitted } from '../testBuiltIns';
import { validateViewOptions } from './viewUtils';
import reduceView from './reducers/reduceView';

const createTestViewFunction = (contextName,viewName) => {
    return (opts) => {
        let {context,database} = getTestContext(contextName);
        if(context.views[viewName].map){
            let options = validateViewOptions(Boolean(context.views[viewName].reduce),opts);
            let viewResult;
            if(database){
                database.forEach(doc => context.views[viewName].map(doc));
                viewResult = emitted(contextName);
            }else{
                throw('For map/reduce testing you need to provide a testDatabase in createTestContext second parameter.');
            }
            if(options.reduce){
                return reduceView(viewResult,options,contextName,viewName);
            }else{
                return viewResult;    
            }
        }else{
            throw(`Missing map function in ${context.id}/views/${viewName}!`);
        }
    }
}

export default createTestViewFunction;