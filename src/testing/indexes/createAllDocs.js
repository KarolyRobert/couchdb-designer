import {testEnvironment,getTestContext} from '../../../build/testing/testEnvironment';
import { emitted } from '../testBuiltIns';


const createAllDocs = (contextId) => {
    let context = getTestContext(contextId);
    if(!context){
        testEnvironment(contextId);
        context = getTestContext(contextId);
    }
    let {server} = context;
  
    server['allDocs'] = (partition = false) => {
        let {database,buildIns} = getTestContext(contextId);
        const map = doc => {
            buildIns.contextedEmit(doc,doc._id,{rev:doc._rev});
        }
        if(partition){
            if(database.partitioned){
                database.data.filter(doc => {
                    return partition === doc._id.split(':')[0];
                }).forEach(pdoc => map(pdoc));
            }else{
                throw({error:"bad_request",reason:"database is not partitioned"});
            }
        }else{
            database.data.forEach(doc => map(doc));
        }
        return emitted(contextId);
    };
    
}

export default createAllDocs;