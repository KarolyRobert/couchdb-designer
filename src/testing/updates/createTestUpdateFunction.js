import {getTestContext} from '../../../build/testing/testEnvironment';
import { update } from '../changes/updateDocument';
import supplementRequest from '../../util/supplementRequest';

const getDocument = (database,id) => {
    let doc = false;
    if(id){
        for(let document of database){
            if(id === document._id){
                doc = {...document};
            }
        }
    }
    return doc;
}

const createTestUpdateFunction = (contextId,updateName,context) => {
    return (req,id) => {
        try{
            if(typeof req === 'object'){
                let {database} = getTestContext(contextId);
                let request = supplementRequest(req,id,contextId,`testdatabase/${context.id}/_updates/${updateName}`,true);
                let oldDoc = getDocument(database,id);
                let result = context.updates[updateName](oldDoc ? {...oldDoc} : undefined ,request);
                if(result && Array.isArray(result) && result.length === 2){
                    let newDoc = result[0];
                    if(newDoc === null){
                        return result[1];
                    }else if(typeof newDoc === 'object' && newDoc._id){
                        let change = update(contextId,newDoc,request.userCtx);
                        return result[1];
                    }else{
                        return `An update function result's first element must be null or object but this is ${newDoc}!`;
                    }
                }else{
                    return `An update function must return a two element array! update.${updateName} result is ${result}`;
                }
            }else{
                return `Missing request parameter in calling update.${updateName}!`;
            }
        }catch(error){
            return error;
        }
    };
}


export default createTestUpdateFunction;