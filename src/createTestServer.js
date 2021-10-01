import fs from 'fs/promises';
import createTestContext from './createTestContext';
import { registerContext } from '../build/testing/testEnvironment';
import testBuiltIns from './testing/testBuiltIns';
import createCouchDBFunctions from './testing/createCouchDBFunctions';
import crypto from 'crypto';
import path from 'path';

const createTestServer = (directoryName,testDatabase,userCtx,secObj) => {
    return new Promise((resolve,reject) => {
        let root = path.join(directoryName);
        let fullPath = path.resolve(process.env.PWD,root);
        let contextId = crypto.createHash('md5').update(fullPath).digest('hex');
        fs.readdir(root).then(names => {
            Promise.all(names.map(name => createTestContext(path.join(directoryName,name),null,null,null,contextId)))
                .then(designContexts => {

                    let serverContext = (need,params) => {
                        if(need in testBuiltIns){
                            return testBuiltIns[need](contextId,params);
                        }else{
                            throw(`${need} is not supported! Try "server","emitted","logged" or the needed built-in mockFunction!`);
                        }
                    }
                    let database = {_validators: [],database: testDatabase};
                    for(let designContext of designContexts){
                        if(designContext){
                            let designName = designContext.id.split('/')[1];
                            if(designContext.language.toLowerCase() === 'javascript'){
                                createCouchDBFunctions(contextId, designContext, designName);
                            }
                            serverContext[designName] = designContext;
                            
                            if(designContext.validate_doc_update){
                                database._validators.push({parentName:designContext.id,validator:designContext.validate_doc_update});
                            }
                            
                        }
                    }
                    registerContext(contextId, serverContext, database, userCtx, secObj);
                    resolve(serverContext);
                })
                .catch(err => reject(err));
                
        },err => reject(err));

    });
}

export default createTestServer;