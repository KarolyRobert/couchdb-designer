import fs from 'fs/promises';
import path from 'path';
import createMangoIndex from './testing/mango/createMangoIndex';
import createCouchDBFunctions from './testing/createCouchDBFunctions';


const createMangoContext = (root,name,isDatabasePartitioned,contextId) => {
    return new Promise((resolve, reject) => {
        let mangoContext = {
            id:`_design/${name}`,
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
                    for(let view of views){
                        mangoContext.views = Object.assign(mangoContext.views,view);
                    }
                    createCouchDBFunctions(contextId,mangoContext,name);
                    resolve(mangoContext);
                },reject);
                
            }catch(err){
                reject(err);
            }
        },reject);
    })
}

export default createMangoContext;