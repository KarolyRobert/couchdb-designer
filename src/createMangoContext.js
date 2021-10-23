import fs from 'fs/promises';
import path from 'path';
import createMangoIndex from './testing/mango/createMangoIndex';
import createCouchDBFunctions from './testing/createCouchDBFunctions';
import { getTestContext } from '../build/testing/testEnvironment';
import compileSelector from './util/compileSelector';

const createIndexDef = index => {
    let def = {};
    def.fields = index.fields.map(field => {
        if(typeof field === 'string'){
            return {[field]:'asc'};
        }else{
            return field;
        }
    });
    if(index.partial_filter_selector){
        def.partial_filter_selector = compileSelector(index.partial_filter_selector);
    }
    return def;
}


const createMangoContext = (root,name,isDatabasePartitioned,contextId) => {
    return new Promise((resolve, reject) => {
        let ddocName = name.split('.')[0];
        let mangoContext = {
            id:`_design/${ddocName}`,
            language:'query',
            views:{}
        }
        let contextProps = {root,name,contextId};
        let filePath = path.join(root,name);
        fs.readFile(filePath).then(fileContent => {
            try{
                let mangoJson = JSON.parse(fileContent);
                let keys = Object.keys(mangoJson).filter(field => field !== 'partitioned');
                if(mangoJson.partitioned && !isDatabasePartitioned){
                    throw(`You cannot create partitioned indexes in a non partitioned database! You can fix it in ${filePath}.`);
                }
                Promise.all(keys.map(indexName => createMangoIndex(mangoJson[indexName],indexName,contextProps))).then(views => {
                    const {indexes} = getTestContext(contextId);
                    for(let view of views){
                        let indexName = Object.keys(view)[0];
                        indexes.push({
                            ddoc:mangoContext.id,
                            name:indexName,
                            type:'json',
                            partitioned:mangoJson.partitioned ? mangoJson.partitioned : false,
                            def:createIndexDef(view[indexName].options.def)
                        });
                        mangoContext.views = Object.assign(mangoContext.views,view);
                    }
                    createCouchDBFunctions(contextId,mangoContext,ddocName);
                    resolve(mangoContext);
                },reject);
                
            }catch(err){
                reject(err);
            }
        },reject);
    })
}

export default createMangoContext;