import {getTestContext} from '../../../build/testing/testEnvironment';
import createMangoFilter from './createMangoFilter';
import getMangoIndexRows from '../indexes/getMangoIndexRows';
import getMatchingIndex from '../../util/getMatchingIndex';
import createFieldsMap from '../../util/createFieldsMap';



const createMangoFind = contextId => {
    return (query, partition) => {
        let context = getTestContext(contextId);
        let filter = createMangoFilter(query.selector);
        let index = getMatchingIndex(context.indexes,query,partition);
        let indexRows = getMangoIndexRows(context,index,partition);
        let documents = indexRows.map(({id}) => {
            for(let doc of context.database.data){
                if(doc._id === id){
                    return doc;
                }
            }
        }).filter(doc => filter(doc));
        if(query.fields){
            if(Array.isArray(query.fields)){
                return {docs:documents.map(createFieldsMap(query.fields))};
            }else{
                throw('The "fields" field of query must be an array of strings!');
            }
        }else{
            return {docs:documents}
        }
    }
}

export default createMangoFind;

