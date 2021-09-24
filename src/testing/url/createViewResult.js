import { getTestContext } from '../../../build/testing/testEnvironment';
import { emitted } from '../testResults';


const createViewResult = (contextName,testData,viewName,params) => {
    if(Array.isArray(testData) && testData.length ) {
        let context = getTestContext(contextName).context;
        if( context.views && context.views[viewName] && context.views[viewName].map ) {
            
            testData.forEach(doc => {
                context.views[viewName].map(doc);
            });
            let result = emitted(contextName);
            if(context.views[viewName].reduce){
                
            }
            return result;
        }else{
            throw new Error(`Missing view ${context.id}.views.${viewName}!`);
        }
    }else{
        throw new Error('createTestContext second parameter must be an array of document object to represent the data of testing database for view testing!');
    }
}


export default createViewResult;